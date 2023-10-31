from rest_framework.views import APIView
from rest_framework.response import Response
from app.models import Snippet
from app.serializers import SnippetSerializer

class SnippetList(APIView):
    def get(self, request, format=None):
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return Response(serializer.data)