"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from django.contrib.auth.models import User
from django.contrib.auth.models import User
from rest_framework import routers,serializers,viewsets
from backend import views
from backend.views import ProductsView
from rest_framework_simplejwt.views import (
    TokenVerifyView
)
from django.conf import settings
from django.conf.urls.static import static

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields =['url', 'username', 'email', 'is_staff']

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
#router = routers.DefaultRouter()
#router.register(r'user', views.UserApiView, 'user')

urlpatterns = [
    url(r'api/user/', views.UserApiLoginView, name = 'user'),
    url(r'api/changeuserinfo/', views.ChangeUserInfoView, name = 'changeuserinfo'),
    #url(r'api/products/', views.ProductsView, name = 'products'),
    path('api/products/', ProductsView.as_view(), name = 'products'),
    url(r'api/productsbycategory/', views.ProductsByCategoryView, name = 'productsbycategory'),
    url(r'api/filteredproductsbycategory/', views.FilteredProductsByCategoryView, name = 'filteredproductsbycategory'),
    url(r'api/register/', views.UserApiRegisterView, name = 'register'),
    path('admin/', admin.site.urls),
    #path('api/', include(router.urls)),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'), #NOT WORKING AT THE MOMENT WILL CHANGE
    url(r'api/home/', views.HomeProductsView, name = 'home'), 
    url(r'api/commentandrating/', views.GetCommentsAndRatingsView, name = 'comment'), 
    url(r'api/addcommentandrating/', views.AddCommentAndRatingView, name = 'addcomment'),
    url(r'api/singleproduct/', views.SingleProductView, name = 'getaproduct'),
    url(r'api/approvecomment/', views.ApproveCommentView, name = 'approvecomment'),
    url(r'api/cart/', views.CartView, name = 'cart'),
    url(r'api/addtocart/', views.AddtoCartView, name = 'addtocart'),
    url(r'api/removefromcart/', views.RemoveFomCartView, name = 'removefromcart'),
    url(r'api/search/', views.SearchView, name = 'search'),
    url(r'api/order/', views.AddOrderView, name = 'order'),
    url(r'api/usersorders/', views.GetOrdersView, name = 'usersorders'),
    url(r'api/invoice/', views.InvoicetoPDFView, name = 'invoice'),
    url(r'api/cancelproductinorder/', views.CancelProductInOrderView, name = 'cancelproductinorder'),
    url(r'api/allorders/', views.AllOrdersView, name = 'allorders'),
    url(r'api/getanorder/', views.GetSingleOrderView, name = 'getanorder'),
    url(r'api/allinvoices/', views.GetInvoicesView, name = 'allinvoices'),
    url(r'api/adddiscount/', views.AddDiscountView, name = 'adddiscount'),
    url(r'api/getdiscounts/', views.GetDiscountsView, name = 'getdiscounts'),
    url(r'api/getadiscount/', views.GetSingleDiscountView, name = 'getadiscount'),
    url(r'api/addproductstodiscount/', views.AddProductsToDiscountView, name = 'addproductstodiscount'),
    url(r'api/wowimrich/', views.CalculateRevenueView, name = 'wowimrich'),
    url(r'api/getinvoiceinrange/', views.GetInvoiceinRangeView, name = 'getinvoiceinrange'),
    url(r'api/refundrequest/', views.RefundRequestView, name = 'refundrequest'),
    url(r'api/allrefunds/', views.GetAllRefundsView, name = 'allrefunds'),
    url(r'api/approverefund/', views.ApproveRefundRequestView, name = 'approverefund'),
    url(r'api/declinerefund/', views.DeclineRefundRequestView, name = 'declinerefund'),
    url(r'api/changeohpstatus/', views.ChangeOHPStatusView, name = 'changeohpstatus'),
    url(r'api/getpendingcomments/', views.GetPendingCommentsView, name = 'getpendingcomments'),
    url(r'api/changecommentstatus/', views.ChangeCommentStatusView, name = 'changecommentstatus'),
    

]

if settings.DEBUG:
  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
