import json
from django.db import models, DatabaseError
from django.conf import settings
from core.helpers.redis import Redis

class BaseModel():
    ss_user_id = None
    search_fields = ('name', )
    cache_fields = ('id', 'name')
    ignore_fields = ('csrfmiddlewaretoken', 'view', 'id')

    def __str__(self):
        return str(self.id)
    
    # List item
    @classmethod
    def list_item(cls, params={}, task=None, **kwargs):
        if task == 'cache':
            REDIS = Redis(0)
            cache_key = kwargs.get('cache_key') or f'{cls._meta.db_table}__'
            result = REDIS.get(cache_key)
            if not result:
                result = {}
                items = cls.setup_queryset(params, **kwargs, columns=cls.cache_fields)
                for item in items:
                    result[item['id']] = item
                if settings.USE_CACHE:
                    REDIS.set(cache_key, result)
            return result
        return cls.setup_queryset(params, **kwargs).all()
    
    @classmethod
    def get_item_by_id(cls, id, **kwargs):
        try:
            result = cls.objects
            db_alias = cls.__dict__.get('db_alias', kwargs.get('db_alias'))
            if db_alias:
                result = result.using(db_alias)
            if kwargs.get('select_related'):
                result = result.select_related(*kwargs['select_related'])
            if kwargs.get('prefetch_related'):
                result = result.prefetch_related(*kwargs['prefetch_related'])
            if kwargs.get('columns'):
                result = result.values(*kwargs['columns'])
            return result.get(id=id)
        except Exception:
            return None
        
    @classmethod
    def get_item(cls, params: dict, **kwargs):
        try:
            return cls.setup_queryset(params, **kwargs).first()
        except Exception:
            return None
        
    @classmethod
    def save_item(cls, params: dict, task: str, **kwargs):
        is_multiple = kwargs.get('is_multiple', False)
        db_alias = cls.__dict__.get('db_alias', kwargs.get('db_alias'))
        if task == 'add':
            try:
                # Tạo nhiều
                if is_multiple:
                    data = []
                    for item in params:
                        data.append(cls.setup_data(item))
                    res = cls.objects
                    if db_alias:
                        res = res.using(db_alias)
                    res = res.bulk_create(data)
                    cls.clear_cache()
                    return res
                # Tạo một
                ext = {}
                if db_alias:
                    ext.update({'using': db_alias})
                item = cls(**cls.setup_data(params))
                item.save(**ext)
                cls.clear_cache()
                return item
            except DatabaseError as e:
                print(f'Error {cls._meta.db_table}: ', e, flush=True)
                return None
        
        if task == 'edit':
            result = cls.objects
            if db_alias:
                result = result.using(db_alias)
            item = result.get(id=params['id'])
            if not item:
                return None
            item = cls.set_data_update(item, params)
            ext = {}
            if db_alias:
                ext.update({'using': db_alias})
            try:
                item.save(**ext)
                cls.clear_cache()
                return item
            except DatabaseError as e:
                print(f'Error {cls._meta.db_table}: ', e, flush=True)
                return None

    @classmethod
    def check_field_exist(cls, field_name):
        try:
            is_exits = bool(cls._meta.get_field(field_name))
        except:
            return False
        return is_exits      

    @classmethod
    def setup_data(cls, params, task=None, **kwargs):
        res = {}
        for field in cls._meta.get_fields():
            if not cls.check_is_valid_field(field):
                continue
            db_column = field.db_column if field.db_column else field.column
            if (not task and db_column == 'create_id') or (task == 'edit' and db_column == 'update_id'):
                res[db_column] = cls.ss_user_id
                continue
            if db_column not in params:
                continue
            res[db_column] = cls.get_value(params, field)
        return res    
    
    def check_is_valid_field(cls, field):
        if isinstance(field, models.ManyToOneRel) or isinstance(field, models.ManyToManyRel) or field.get_internal_type() in ('ManyToManyField', ):
            return False
        db_column = field.db_column if field.db_column else field.column
        if db_column == 'id':
            return False
        return True
    
    @classmethod
    def setup_queryset(cls, params={}, **kwargs):
        result = cls.objects()
        db_alias = cls.__dict__.get('db_alias', kwargs.get('db_alias'))
        if db_alias:
            result = result.using(db_alias)
        if kwargs.get('select_related'):
            result = result.select_related(*kwargs['select_related'])
        if kwargs.get('prefetch_related'):
            result = result.prefetch_related(*kwargs['prefetch_related'])
        if kwargs.get('columns'):
            result = result.values(*kwargs['columns'])
        if kwargs.get('annotate'):
            result = result.annotate(*kwargs.get('annotate'))
        search_fields = kwargs.get('search_fields', cls.search_fields)
        filter = models.Q()
        for key in params:
            if key in settings.NON_FILTER_FIELDS:
                continue
            value = params[key]
            if value == '':
                continue
            is_negative = bool('!' in key)
            if is_negative:
                key = key.replace('!', '')
            if key == 'keyword':
                filter_keyword = models.Q()
                for item_field in search_fields:
                    filter_keyword |= models.Q(**{f'{item_field}__icontains': value})
                filter &= filter_keyword
                continue
            key_split = key.rsplit('__', 1)
            filed_name = key_split[0]
            if not cls.check_field_exist(filed_name):
                continue
            field_type = cls._meta.get_field(filed_name).get_internal_type()
            if field_type in ('BooleanField', 'ForeignKey') and not value:
                continue
            filter &= ~models.Q(**{key: value}) if is_negative else models.Q(**{key: value})
        result = result.filter(filter)
        if params.get('order_by'):
            result = result.order_by(params['order_by'])
        return result
    
    @classmethod
    def clear_cache(cls):
        from core.helpers.redis import Redis
        REDIS = Redis(0)
        keys_matching = REDIS.keys(f'{cls._meta.db_table}__*')
        if keys_matching:
            REDIS.delete(keys_matching)