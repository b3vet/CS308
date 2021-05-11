from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
from .serializers import UsersSerializer
from .serializers import ProductsSerializer
from .serializers import CommentsSerializer
from rest_framework.renderers import JSONRenderer
import json
from django.http import JsonResponse
from .models import Users
from .models import Products
from .models import Category
from .models import Comments
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404

@api_view(['GET', 'POST'])
def UserApiLoginView(request):
    if request.method == 'GET': 
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED) #GET NOT ALLOWED FOR LOGIN
    elif request.method == 'POST':
        uname = ''
        uname = request.data['uname']
        password = request.data['password']

        user = authenticate(username=uname, password=password) #TRY TO AUTHENTICATE
        if user is not None: #IF AUTHENTICATED
            refresh = RefreshToken.for_user(user)
            usersObj = Users.objects.get(user_id=user.id)
            serializer = UsersSerializer(usersObj)
            usercontent = JSONRenderer().render(serializer.data)
            content = {'refresh': str(refresh), 'access': str(refresh.access_token), 'user': serializer.data}
            return Response(content, status=status.HTTP_201_CREATED) #SEND USER DATA AND TOKENS TO THE CLIENT APP
        else: 
            return Response({}, status = status.HTTP_406_NOT_ACCEPTABLE) #IF NOT AUTHENTICATED SEND HTTP406
    
    
@api_view(['GET', 'POST'])
def UserApiRegisterView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED) #GET NOT ALLOWED
    elif request.method == 'POST':
        try:
            if not request.data['uname'] or not request.data['password'] or not request.data['email'] or not request.data['name'] or not request.data['surname'] or not request.data['taxID'] or not request.data['phoneNumber']:
                return Response({"error":"Please fill all the fields!"}, status=status.HTTP_400_BAD_REQUEST)
            uname = request.data['uname']
            password = request.data['password']
            mail = request.data['email']
            check = User.objects.filter(username=uname)
            if check: #USERNAME ALREADY EXISTS
                return Response({}, status=status.HTTP_226_IM_USED)
            usersObj = Users()
            usersObj.name = request.data['name']
            usersObj.surname = request.data['surname']
            usersObj.role = 'customer'
            usersObj.taxID = request.data['taxID']
            usersObj.phoneNumber = request.data['phoneNumber']
            user = User.objects.create_user(uname, mail, password)
            user.save()
            usersObj.user=user
            usersObj.email = mail
            usersObj.save()
            serializer = UsersSerializer(usersObj)
            if user is not None: #after success the user that is created is sent back as the response in order to check 
                content = {'user': serializer.data}
                return Response(content, status=status.HTTP_201_CREATED)
            else:
                return Response({}, status=status.HTTP_400_BAD_REQUEST) #MAY BE ANY KIND OF ERROR
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def ProductsByCategoryView(request):
    if request.method == 'GET':
        pass #for now 
    else:
        try:
            catid = request.data['caid']
            products = Products.objects.filter(caid = catid)
            serializer = ProductsSerializer(products, many=True)
            return Response({'products': serializer.data})
        except:
            return Response({}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def HomeProductsView(request):
    if request.method == 'POST':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'GET':
        wid = Category.objects.filter(categoryName = "Wedding Rings")[0].caid
        enid = Category.objects.filter(categoryName = "Engagement Rings")[0].caid
        wproducts = Products.objects.filter(caid = wid).order_by('totalRating')
        enproducts = Products.objects.filter(caid = enid).order_by('totalRating')
        tosendw = []
        tosende = []
        if len(wproducts) >= 8:
            tosendw = wproducts[0:8]
        else:
            tosendw = wproducts[0:] 
        if len(enproducts) >= 8:
            tosende = enproducts[0:8]
        else:
            tosende = enproducts[0:]
        serializer = ProductsSerializer(tosende, many=True)
        serializer2 = ProductsSerializer(tosendw, many = True)
        return Response({'engagement': serializer.data, 'wedding' : serializer2.data})

@api_view(['GET', 'POST'])
def AddCommentAndRatingView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            rpid = request.data['pid']
            #saved_product = get_object_or_404(Products.objects.all(), pk=rpid)
            request.data['comment']['rating'] = int(request.data['comment']['rating'])
            serializer = CommentsSerializer(data=request.data['comment']) #comment has rating, approved = false, comment, uid, pid (dateTimeAdded will be given as null so that now will be added to db)
            #saved_product.totalRating = saved_product.totalRating + request.data['comment']['rating']
            #saved_product.ratingCount = saved_product.ratingCount + 1
            #saved_product.save()
            if serializer.is_valid(raise_exception=True):
                comment_saved = serializer.save() #do not forget to rename the image file as the product name before sending it
            return Response({"success": "Comment '{}' created successfully".format(comment_saved.coid)}, status = status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def GetCommentsAndRatingsView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            rpid = request.data['pid']
            check = Products.objects.filter(pid = rpid)
            if not check:
                return Response({}, status = status.HTTP_404_NOT_FOUND)
            comments = Comments.objects.filter(pid = rpid).filter(approved=True).order_by('dateTimeAdded')
            product = Products.objects.filter(pid = rpid)[0]
            avgRating = product.totalRating / product.ratingCount
            serializer = CommentsSerializer(comments, many=True)
            content = {'comments': serializer.data, 'avgRating': avgRating}
            return Response(content)
        except:
            return Response({}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def SingleProductView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            rpid = request.data['pid']
            product = Products.objects.filter(pid=rpid)
            if not product:
                return Response({}, status = status.HTTP_404_NOT_FOUND)
            serializer = ProductsSerializer(product,many=True)
            comments = Comments.objects.filter(pid = rpid).filter(approved=True).order_by('dateTimeAdded')
            if product[0].ratingCount == 0:
                avgRating = 0
            else:
                avgRating = product[0].totalRating / product[0].ratingCount
            serializer2 = CommentsSerializer(comments, many=True)
            content = {"product": serializer.data, "comments": serializer2.data, "avgRating": avgRating}
            return Response(content)
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)
class ProductsView(APIView):
    parser_class = (FileUploadParser,)
    def get(self, request):
        products = Products.objects.all()
        # the many param informs the serializer that it will be serializing more than a single product.
        serializer = ProductsSerializer(products, many=True)
        return Response({"products": serializer.data})

    def post(self,request):
        try:
            check = Products.objects.filter(name = request.data["name"])
            if check:
                return Response({}, status = status.HTTP_226_IM_USED)
            request.data["caid"] = int(request.data["caid"])
            product = request.data
            serializer = ProductsSerializer(data=product)
            if serializer.is_valid(raise_exception=True):
                product_saved = serializer.save() #do not forget to rename the image file as the product name before sending it
            return Response({"success": "Product '{}' created successfully".format(product_saved.name)}, status = status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)
        

    def put(self, request):
        try:
            rpid = request.data['pid']
            saved_product = get_object_or_404(Products.objects.all(), pk=rpid)
            data = request.data
            serializer = ProductsSerializer(instance=saved_product, data=data, partial=True)
            if serializer.is_valid(raise_exception=True):
                product_saved = serializer.save()
            return Response({"success": "Product '{}' updated successfully".format(product_saved.name)})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        try:
        # Get object with this pk
            rpid = request.data['pid']
            product = get_object_or_404(Products.objects.all(), pk=rpid)
            product.delete()
            return Response({"success": "Product with id `{}` has been deleted.".format(rpid)})
        except Exception as e :
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def ApproveCommentView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            coid = request.data['coid']
            comment = get_object_or_404(Comments.objects.all(), pk=coid)
            comment.approved = True
            comment.save()

            rpid = comment.pid.pid
            saved_product = get_object_or_404(Products.objects.all(), pk=rpid)
            saved_product.totalRating = saved_product.totalRating + int(comment.rating)
            saved_product.ratingCount = saved_product.ratingCount + 1
            saved_product.save()
            return Response({"success": "Comment approved successfully"})
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def ChangeUserInfoView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            uid = request.data['uid']
            user = get_object_or_404(Users.objects.all(), pk=uid)
            user.name = request.data['name']
            user.surname = request.data['surname']
            user.taxID = request.data['taxID']
            user.phoneNumber = request.data['phone']
            user.email = request.data['email']
            user.user.set_password(request.data['password'])
            user.user.save()
            user.save()
            serializer = UsersSerializer(user)
            return Response({"success": "Info changed successfully", "user": serializer.data})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)