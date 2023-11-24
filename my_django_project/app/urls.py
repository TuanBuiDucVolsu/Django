from django.urls import path
# from rest_framework.urlpatterns import format_suffix_patterns
# from app import views
from rest_framework_simplejwt import views as jwt_views
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]

# urlpatterns = format_suffix_patterns(urlpatterns)