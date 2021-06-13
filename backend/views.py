from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
from .serializers import *
from rest_framework.renderers import JSONRenderer
import json
from django.http import JsonResponse
from .models import *
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.db.models import Count
from io import BytesIO
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
import io
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr
from email.message import EmailMessage
from django.core.files.base import ContentFile

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
            toSend = serializer.data
            for i in toSend:
                if i["did"] is not None:
                    discount = Discount.objects.get(did = i['did'])
                    i["discountPrice"] = i["price"] * (100-discount.ratio) / 100
                else:
                    i["discountPrice"] = i["price"]
            return Response({'products': toSend})
        except:
            return Response({}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def FilteredProductsByCategoryView(request):
    if request.method == 'GET':
        pass #for now
    else:
        try:
            catid = request.data['caid']
            minPrice = int(request.data['minPrice'])
            maxPrice = int(request.data['maxPrice'])
            material = request.data['material']
            color = request.data['color']
            if material != "all":
                products = Products.objects.filter(caid = catid, material = material, price__lte=maxPrice, price__gte=minPrice)
            if color != "all":
                products = Products.objects.filter(caid = catid, color = color, price__lte=maxPrice, price__gte=minPrice)
            if material != "all" and color != "all":
                products = Products.objects.filter(caid = catid, color = color, material = material, price__lte=maxPrice, price__gte=minPrice)
            serializer = ProductsSerializer(products, many=True)
            toSend = serializer.data
            for i in toSend:
                if i["did"] is not None:
                    discount = Discount.objects.get(did = i['did'])
                    i["discountPrice"] = i["price"] * (100-discount.ratio) / 100
                else:
                    i["discountPrice"] = i["price"]
            return Response({'products': toSend})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

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
        toSend = serializer.data
        toSend2 = serializer2.data
        for i in toSend:
            if i["did"] is not None:
                discount = Discount.objects.get(did = i['did'])
                i["discountPrice"] = i["price"] * (100-discount.ratio) / 100
            else:
                i["discountPrice"] = i["price"]
        for i in toSend2:
            if i["did"] is not None:
                discount = Discount.objects.get(did = i['did'])
                i["discountPrice"] = i["price"] * (100-discount.ratio) / 100
            else:
                i["discountPrice"] = i["price"]
        return Response({'engagement': toSend, 'wedding' : toSend2})

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
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

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
            toSend = serializer.data
            if product[0].did is not None:
                toSend[0]["discountPrice"] = (100-product[0].did.ratio) * product[0].price / 100
            else:
                toSend[0]["discountPrice"] = product[0].price
            content = {"product": toSend, "comments": serializer2.data, "avgRating": avgRating}
            return Response(content)
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)
class ProductsView(APIView):
    parser_class = (FileUploadParser,)
    def get(self, request):
        products = Products.objects.all()
        # the many param informs the serializer that it will be serializing more than a single product.
        serializer = ProductsSerializer(products, many=True)
        toSend = serializer.data
        for i in toSend:
            if i["did"] is not None:
                discount = Discount.objects.get(did = i['did'])
                i["discountPrice"] = i["price"] * (100-discount.ratio) / 100
            else:
                i["discountPrice"] = i["price"]
        return Response({"products": toSend})

    def post(self,request):
        try:
            check = Products.objects.filter(name = request.data["name"])
            if check:
                return Response({}, status = status.HTTP_226_IM_USED)
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
            product.image.delete()
            product.delete()
            products = Products.objects.all()
            serializer = ProductsSerializer(products, many=True)
            toSend = serializer.data
            for i in toSend:
                if i["did"] is not None:
                    discount = Discount.objects.get(did = i['did'])
                    i["discountPrice"] = i["price"] * (100-discount.ratio) / 100
                else:
                    i["discountPrice"] = i["price"]
            return Response({"success": "Product with id `{}` has been deleted.".format(rpid), "products": toSend})
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

            product = comment.pid
            
            product.totalRating = product.totalRating + int(comment.rating)
            product.ratingCount = product.ratingCount + 1
            product.save()
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

@api_view(['GET', 'POST'])
def CartView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            user = get_object_or_404(Users.objects.all(), pk=request.data["uid"])
            cart = Cart.objects.filter(uid = user)
            products= []
            for i in range(len(cart)):
                products += Products.objects.filter(pid = cart[i].pid.pid)


            serializer = ProductsSerializer(products, many=True)
            toSend = serializer.data
            total = 0
            for i in toSend:
                product = Products.objects.get(pid = i["pid"])
                cartEntry = Cart.objects.filter(pid = product).filter(uid = user)[0]
                i["quantity"] = cartEntry.quantity
                if i["did"] is not None:
                    discount = Discount.objects.get(did = i['did'])
                    i["discountPrice"] = i["price"] * (100-discount.ratio) / 100
                else:
                    i["discountPrice"] = i["price"]
                total += i["quantity"] * i["discountPrice"]


            content = {'products': toSend, 'total': total}
            return Response(content)
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def AddtoCartView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            #rpid = request.data['pid']
            productInCart = get_object_or_404(Products.objects.all(), pk=request.data['cart']['pid'])
            if productInCart.stock == 0:
                return Response({"outofstock" : "Sorry :( Product named " + productInCart.name + " is out of stock. You cannot add it to your cart."},status=status.HTTP_410_GONE)
            user = get_object_or_404(Users.objects.all(), pk=request.data['cart']['uid'])
            isThereAny = Cart.objects.filter(pid = productInCart).filter(uid = user)
            if isThereAny:
                isThereAny[0].quantity +=1
                isThereAny[0].save()
                return Response({"success": "Cart items quantity is increased."})
            serializer = CartSerializer(data=request.data['cart'])
            if serializer.is_valid(raise_exception=True):
                cart_saved = serializer.save()
            return Response({"success": "Cart with cart id '{}' added successfully".format(cart_saved.cartid)})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def RemoveFomCartView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            #rpid = request.data['pid']
            productInCart = get_object_or_404(Products.objects.all(), pk=request.data['cart']['pid'])
            user = get_object_or_404(Users.objects.all(), pk=request.data['cart']['uid'])
            isThereAny = Cart.objects.filter(pid = productInCart).filter(uid = user)

            if isThereAny:
                cartid = isThereAny[0].cartid
                if isThereAny[0].quantity == 1:
                    isThereAny.delete()
                    return Response({"success": "Cart with cart id '{}' deleted successfully".format(cartid)})
                else:
                    isThereAny[0].quantity -= 1
                    isThereAny[0].save()
                    return Response({"success": "Cart with cart id '{}' decremented quantity successfully".format(cartid)})
            else:
                return Response({"error": "This product is not in anyones cart."}, status = status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)


#addmultipleproductstocart, order, invoice, delivery list
#addorder, belli bir userın orderlarını görme, bütün orderları görme, orderların statustunu değiştirme
#addorderın içinde invoice oluştur bi tane, bütün invoiceları görme, tek bir usera ait invoice, belli bir ordera ait invoice görme

@api_view(['GET', 'POST'])
def SearchView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            query = request.data['query']
            matching = Products.objects.filter(description__icontains = query) | Products.objects.filter(name__icontains = query)
            matchingFin = matching.annotate(pid_count=Count('pid')).filter(pid_count=1)
            serializer = ProductsSerializer(matching, many=True)
            toSend = serializer.data
            for i in toSend:
                if i["did"] is not None:
                    discount = Discount.objects.get(did = i['did'])
                    i["discountPrice"] = i["price"] * (100-discount.ratio) / 100
                else:
                    i["discountPrice"] = i["price"]
            return Response({"results": toSend})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def AddOrderView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            #create the order first

            uid = request.data['uid']
            address = request.data['address']
            afterLogin = request.data['afterLogin']
            order = Order()
            user = Users.objects.filter(uid = uid)[0]
            cartItems = Cart.objects.filter(uid = user)
            orderedProducts = []
            for i in cartItems:
                product = Products.objects.filter(pid = i.pid.pid)
                for j in range(i.quantity):
                    orderedProducts+=product

            order.uid = user
            order.deliveryAddress = address
            order.save()
            totalPrice = 0
            for product in orderedProducts:
                actualProduct = Products.objects.filter(pid = product.pid)[0]
                if actualProduct.stock == 0:
                    return Response({"outofstock" : "Sorry :( Product named " + actualProduct.name + " is out of stock."},status=status.HTTP_410_GONE)
                actualProduct.stock-=1
                actualProduct.save()
                ohp = OrderHasProducts()
                if actualProduct.did is not None:
                    ohp.orderedPrice = actualProduct.price * (100-actualProduct.did.ratio) / 100
                else:
                    ohp.orderedPrice = actualProduct.price
                totalPrice += ohp.orderedPrice
                ohp.oid = order
                ohp.pid = actualProduct
                ohp.save()
            invoice = Invoice()
            invoice.fullName = request.data["name"] + " " + request.data["surname"]
            invoice.oid = order
            invoice.paidAmount = totalPrice
            invoice.isActive = True
            invoice.uid = user
            invoice.address = request.data["invoiceAddress"]
            invoice.date = order.date
            invoice.save()
            if not afterLogin:
                cartItems.delete()
            return Response({"sucess": "Successful order."})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def GetOrdersView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            user = get_object_or_404(Users.objects.all(), pk = request.data['uid'])
            order = Order.objects.filter(uid = user)
            serializer = OrderSerializer(order, many=True)
            toSend = serializer.data
            for i in toSend:
                check = False
                productsInOrder = OrderHasProducts.objects.filter(oid = i["oid"])
                serializer2 = OrderHasProductsSerializer(productsInOrder, many=True)
                toSend2 = serializer2.data
                for j in toSend2:
                    if j["status"] != "DELIVERED":
                        check = True
                    productOfThatConnection = Products.objects.filter(pid = j["pid"])[0]
                    serializer3 = ProductsSerializer(productOfThatConnection)
                    serializedProduct = serializer3.data
                    serializedProduct["purchasedPrice"] = j["orderedPrice"]
                    j["product"] = serializedProduct
                i["connection"] = toSend2
                if check:
                    i["delivery"] = "Some of the products in this order is not delivered yet or returned or canceled."
                else:
                    i["delivery"] = "Order is completed!"
            return JsonResponse(toSend, safe=False)
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'POST'])
def CancelProductInOrderView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            product = get_object_or_404(Products.objects.all(), pk=request.data["pid"])
            user = get_object_or_404(Users.objects.all(), pk=request.data["uid"])
            order = get_object_or_404(Order.objects.all(),pk = request.data["oid"])
            ohd = OrderHasProducts.objects.filter(oid = order).filter(pid = product).exclude(status = "CANCELED")[0]
            ohd.status = "CANCELED"
            ohd.save()
            ohd = OrderHasProducts.objects.filter(oid = order)
            check = False
            for i in ohd:
                if i.status != "CANCELED" and i.status != "RETURNED":
                    check = True
            if not check:
                invoice = Invoice.objects.filter(oid = order)
                invoice.isActive = False

            orders = Order.objects.filter(uid = user)
            serializer = OrderSerializer(orders, many=True)
            toSend = serializer.data
            for i in toSend:
                check = False
                productsInOrder = OrderHasProducts.objects.filter(oid = i["oid"])
                serializer2 = OrderHasProductsSerializer(productsInOrder, many=True)
                toSend2 = serializer2.data
                for j in toSend2:
                    if j["status"] != "DELIVERED":
                        check = True
                    productOfThatConnection = Products.objects.filter(pid = j["pid"])[0]
                    serializer3 = ProductsSerializer(productOfThatConnection)
                    serializedProduct = serializer3.data
                    serializedProduct["purchasedPrice"] = j["orderedPrice"]
                    j["product"] = serializedProduct
                i["connection"] = toSend2
                if check:
                    i["delivery"] = "Some of the products in this order is not delivered yet or returned or canceled."
                else:
                    i["delivery"] = "Order is completed!"
            
            return Response({"sucess": "Successful cancel.", "orders" : toSend})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def InvoicetoPDFView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        #try:
        order = get_object_or_404(Order.objects.all(), pk=request.data['oid'])

        invoice = Invoice.objects.filter(oid = order)[0]
        orderhasproducts = OrderHasProducts.objects.filter(oid = order)
        #response = HttpResponse(content_type='application/pdf')
        #response['Content-Disposition'] = 'attachment; filename=bandora_invoice.pdf'
        buffer = BytesIO()
        #p = canvas.Canvas(response)
        p = canvas.Canvas(buffer,pagesize=A4)
        p.setFont("Helvetica", 50, leading = None)
        p.setFillColorRGB(0.2,0.4,0.6)
        p.drawString(380, 700, "Invoice")
        p.line(360,680,560,680)
        p.setFillColorRGB(0,0,0)
        p.setFont("Helvetica", 10, leading = None)
        p.drawString(40, 720, "BANDORA")
        p.drawString(40, 700, "Bagdat Street. No:16 ")
        p.drawString(40, 680, "Caddebostan/Istanbul")
        p.drawString(40, 660, "+90 (543) 785 97 68")
        p.setFont("Helvetica", 15, leading = None)
        p.setFillColorRGB(0,0,0)
        p.drawString(20, 560, "Name-Surname:")
        p.drawString(200, 560, invoice.fullName)
        p.drawString(20, 540, "Total paid amount:")
        p.drawString(200, 540, str(invoice.paidAmount))
        p.drawString(20, 520, "Address:")
        p.drawString(200, 520, invoice.address)
        p.drawString(20, 500, "Date:")
        p.drawString(200, 500, str(invoice.date))

        p.drawString(20, 420, "Product Name")
        p.drawString(170, 420, "Product Material")
        p.drawString(320, 420, "Product Color")
        p.drawString(470, 420, "Product Price")
        x = 20
        y= 390
        p.line(15,410,600,410)
        p.setFont("Helvetica", 10, leading = None)
        for i in range(len(orderhasproducts)):
            product = Products.objects.filter(pid = orderhasproducts[i].pid.pid)[0]
            p.drawString(x, y, product.name)
            p.drawString(x + 200, y, product.material)
            p.drawString(x + 300, y, product.color)
            p.drawString(x +450, y, str(orderhasproducts[i].orderedPrice))
            #image = ImageReader(product.image)
            #p.drawImage(image, 100, 700,width = 400,height=100,mask = None)
            y= y-30
        p.setFont("Helvetica", 15, leading = None)
        p.drawString(20, 80, "Thank You!")
        p.drawString(180, 80, "For questions concerning this invoice please contact")
        p.drawString(260, 60, "www.bandora.com")
        p.showPage()
        p.save()
        pdf = buffer.getvalue()
        buffer.close()
        invoice.pdf.delete()
        invoice.pdf.save(str(invoice.iid)+"invoice.pdf", ContentFile(pdf), save=True)
        invoice.save()
        toSend = InvoiceSerializer(invoice).data
        return Response({"pdf":toSend["pdf"]})
        #except Exception as e:
            #return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

"""
@api_view(['GET', 'POST'])
def InvoicetoPDFView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        #try:
        order = get_object_or_404(Order.objects.all(), pk=request.data['oid'])

        invoice = Invoice.objects.filter(oid = order)[0]
        orderhasproducts = OrderHasProducts.objects.filter(oid = order)
        #response = HttpResponse(content_type='application/pdf')
        #response['Content-Disposition'] = 'attachment; filename=bandora_invoice.pdf'
        buffer = BytesIO()
        #p = canvas.Canvas(response)
        p = canvas.Canvas(buffer,pagesize=A4)
        p.setFont("Helvetica", 50, leading = None)
        p.setFillColorRGB(0.2,0.4,0.6)
        p.drawString(250, 700, "Invoice")
        p.setFont("Helvetica", 20, leading = None)
        p.setFillColorRGB(0,0,0)
        p.drawString(20, 580, "Name-Surname:")
        p.drawString(200, 580, invoice.fullName)
        p.drawString(20, 560, "Total paid amount:")
        p.drawString(200, 560, str(invoice.paidAmount))
        p.drawString(20, 540, "Address:")
        p.drawString(200, 540, invoice.address)
        p.drawString(20, 520, "Date:")
        p.drawString(200, 520, str(invoice.date))
        x = 20
        y= 400
        for i in range(len(orderhasproducts)):
            product = Products.objects.filter(pid = orderhasproducts[i].pid.pid)[0]
            p.drawString(x, y-20, product.name)
            p.drawString(x, y-40, product.material)
            p.drawString(x, y-60, product.color)
            p.drawString(x, y-80, str(orderhasproducts[i].orderedPrice))
            #image = ImageReader(product.image)
            #p.drawImage(image, 100, 700,width = 400,height=100,mask = None)
            y= y-100
        p.showPage()
        p.save()
        pdf = buffer.getvalue()
        buffer.close()
        invoice.pdf.delete()
        invoice.pdf.save(str(invoice.iid)+"invoice.pdf", ContentFile(pdf), save=True)
        invoice.save()
        toSend = InvoiceSerializer(invoice).data
        return Response({"pdf":toSend["pdf"]})
        #except Exception as e:
            #return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)
"""
@api_view(['GET', 'POST'])
def AllOrdersView(request):
    if request.method == 'POST':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'GET':
        try:
            orders = Order.objects.all()
            if not orders:
                return Response({"noorder": "There is no order yet!"}, status = status.HTTP_404_NOT_FOUND)
            serializer = OrderSerializer(orders, many=True)
            toSend = serializer.data
            for i in toSend:
                check = False
                productsInOrder = OrderHasProducts.objects.filter(oid = i["oid"])
                if Invoice.objects.filter(oid = i["oid"]).exists():
                    i["iid"] = Invoice.objects.filter(oid = i["oid"])[0].iid
                serializer2 = OrderHasProductsSerializer(productsInOrder, many=True)
                toSend2 = serializer2.data
                for j in toSend2:
                    if j["status"] != "DELIVERED":
                        check = True
                    productOfThatConnection = Products.objects.filter(pid = j["pid"])[0]
                    serializer3 = ProductsSerializer(productOfThatConnection)
                    serializedProduct = serializer3.data
                    serializedProduct["purchasedPrice"] = j["orderedPrice"]
                    j["product"] = serializedProduct
                i["connection"] = toSend2
                if check:
                    i["delivery"] = "Some of the products in this order is not delivered yet or returned or canceled."
                else:
                    i["delivery"] = "Order is completed!"
            return JsonResponse(toSend, safe=False)
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def GetSingleOrderView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            order = get_object_or_404(Order.objects.all(), pk = request.data['oid'])
            serializer = OrderSerializer(order)
            toSend = serializer.data
            ohp = OrderHasProducts.objects.filter(oid = order)
            serializer2 = OrderHasProductsSerializer(ohp, many = True)
            toSend2 = serializer2.data
            for i in toSend2:
                product = Products.objects.filter(pid = i["pid"])[0]
                serializer3 = ProductsSerializer(product)
                serializedP = serializer3.data
                serializedP["purchasedPrice"] = i["orderedPrice"]
                i["product"] = serializedP
            toSend["connection"] = toSend2
            toSend["iid"] = Invoice.objects.get(oid = order).iid
            return JsonResponse(toSend, safe=False)
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def GetInvoicesView(request):
    if request.method == 'POST':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'GET':
        try:
            invoices = Invoice.objects.all()
            # the many param informs the serializer that it will be serializing more than a single product.
            serializer = InvoiceSerializer(invoices, many=True)
            return Response({"invoices": serializer.data})
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def AddDiscountView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            plist= request.data['products']
            start = request.data['startDateTime']
            end = request.data['endDateTime']
            #uid = request.data['uid']
            ratio = request.data['ratio']
            discount = Discount()
            discount.startDateTime = start
            discount.endDateTime = end
            discount.ratio = ratio
            discount.save()
            for i in range(len(plist)):
                actualProduct = Products.objects.filter(pid = plist[i])[0]
                actualProduct.did = discount
                actualProduct.save()

            return Response({"sucess": "Successful discount."})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def GetDiscountsView(request):
    if request.method == 'POST':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'GET':
        try:
            discounts = Discount.objects.all()
            # the many param informs the serializer that it will be serializing more than a single product.
            serializer = DiscountSerializer(discounts, many=True)
            tosend = serializer.data
            for i in tosend:
                discount = Discount.objects.filter(did = i["did"])[0]
                i["products"] = Products.objects.filter(did = discount).values_list("name", flat=True)
            return Response({"discounts": tosend})
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def GetSingleDiscountView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            discount = get_object_or_404(Discount.objects.all(), pk = request.data['did'])
            products = Products.objects.all()
            selectedProducts = Products.objects.filter(did = discount).values_list('pid', flat=True)
            serializer2 = ProductsSerializer(products, many = True)
            serializer = DiscountSerializer(discount)
            return Response({"allproducts": serializer2.data, "selectedproducts": selectedProducts, "discount": serializer.data})
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def AddProductsToDiscountView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            plist= request.data['products']
            discount = get_object_or_404(Discount.objects.all(), pk = request.data['did'])
            for i in range(len(plist)):
                actualProduct = Products.objects.filter(pid = plist[i])[0]
                actualProduct.did = discount
                actualProduct.save()
            return Response({"sucess": "Successful discount."})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def CalculateRevenueView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            start = request.data['startDateTime']
            end = request.data['endDateTime']
            invoices = Invoice.objects.filter(date__gte = start).filter(date__lte = end)
            totalGain = 0
            totalExpense = 0
            for i in invoices:
                productsOfTheInvoice = OrderHasProducts.objects.filter(oid = i.oid)
                for j in productsOfTheInvoice:
                    if j.status != "RETURNED" and j.status != "CANCELED":
                        totalGain += j.orderedPrice
                        totalExpense += j.pid.productionCost
            return Response({"gain":totalGain, "loss":totalExpense})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def RefundRequestView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            product = get_object_or_404(Products.objects.all(), pk=request.data["pid"])
            order = get_object_or_404(Order.objects.all(),pk = request.data["oid"])
            ohd = OrderHasProducts.objects.filter(oid = order).filter(pid = product).filter(status = "DELIVERED")[0]
            reason = request.data["reason"]
            ref = RefundRequest()
            ref.reason = reason
            ref.approved = False
            ref.ohid = ohd
            ref.save()
            ohd.status = 'IN-REVIEW'
            ohd.save()

            
            orders = Order.objects.filter(uid = order.uid)
            serializer = OrderSerializer(orders, many=True)
            toSend = serializer.data
            for i in toSend:
                check = False
                productsInOrder = OrderHasProducts.objects.filter(oid = i["oid"])
                serializer2 = OrderHasProductsSerializer(productsInOrder, many=True)
                toSend2 = serializer2.data
                for j in toSend2:
                    if j["status"] != "DELIVERED":
                        check = True
                    productOfThatConnection = Products.objects.filter(pid = j["pid"])[0]
                    serializer3 = ProductsSerializer(productOfThatConnection)
                    serializedProduct = serializer3.data
                    serializedProduct["purchasedPrice"] = j["orderedPrice"]
                    j["product"] = serializedProduct
                i["connection"] = toSend2
                if check:
                    i["delivery"] = "Some of the products in this order is not delivered yet or returned or canceled."
                else:
                    i["delivery"] = "Order is completed!"
            return Response({"sucess": "Successfully created refundrequest.", "orders": toSend})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def GetInvoiceinRangeView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            start = request.data['startDateTime']
            end = request.data['endDateTime']
            invoices = Invoice.objects.filter(date__gte = start).filter(date__lte = end)
            serializer = InvoiceSerializer(invoices, many=True)
            return Response({"invoices": serializer.data})
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def ApproveRefundRequestView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            ohd = get_object_or_404(OrderHasProducts.objects.all(), pk=request.data["ohid"])
            ohd.status = "RETURNED"
            ohd.save()
            mail = ohd.oid.uid.email
            refReq = RefundRequest.objects.filter(ohid = ohd).delete()


            port = 465  # For SSL
            smtp_server = "smtp.gmail.com"
            sender_email = "kargomuverinartik@gmail.com"  # Enter your address
            receiver_email = mail  # Enter receiver address
            password = "kargomuverukim"
            message = EmailMessage()
            message["Subject"] = "Refund Request Approval"
            message["From"] = formataddr(('Bandora Jewelry Company', 'bandoracompany@bandoraworld.jewelry'))
            message["To"] = receiver_email
            text = """\


            Your request to return the product name {productname} is approved. Please throw it into the space.""".format(productname = ohd.pid.name)

            message.set_content(text)

            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
                server.login(sender_email, password)

                server.sendmail("bandoracompany@bandoraworld.jewelry", receiver_email, message.as_string())


            return Response({"sucess": "Refund request approved successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def DeclineRefundRequestView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            ohd = get_object_or_404(OrderHasProducts.objects.all(), pk=request.data["ohid"])
            ohd.status = "DELIVERED"
            ohd.save()
            mail = ohd.oid.uid.email
            refReq = RefundRequest.objects.filter(ohid = ohd).delete()


            port = 465  # For SSL
            smtp_server = "smtp.gmail.com"
            sender_email = "kargomuverinartik@gmail.com"  # Enter your address
            receiver_email = mail  # Enter receiver address
            password = "kargomuverukim"
            message = EmailMessage()
            message["Subject"] = "Refund Request Declined"
            message["From"] = formataddr(('Bandora Jewelry Company', 'bandoracompany@bandoraworld.jewelry'))
            message["To"] = receiver_email
            text = """\


            Your request to return the product name {productname} is declined. If you think this decision is wrong, you can try to return again with stating your reason more clearly.""".format(productname = ohd.pid.name)

            message.set_content(text)

            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
                server.login(sender_email, password)

                server.sendmail("bandoracompany@bandoraworld.jewelry", receiver_email, message.as_string())


            return Response({"sucess": "Refund request declined successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def GetAllRefundsView(request):
    if request.method == 'POST':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'GET':
        try:
            refunds = RefundRequest.objects.filter(approved = False)
            # the many param informs the serializer that it will be serializing more than a single product.
            serializer = RefundSerializer(refunds, many=True)
            tosend = serializer.data
            for i in tosend:
                ohp = OrderHasProducts.objects.filter(ohid = i["ohid"])[0]
                serializedProduct = ProductsSerializer(ohp.pid)
                i["product"] = serializedProduct.data
            return Response({"refunds": tosend})
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def ChangeOHPStatusView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            ohp = OrderHasProducts.objects.filter(ohid = request.data['ohid'])[0]
            ohp.status = request.data['status']
            ohp.save()
            return Response({"success": "Status changed successfully."})
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def GetPendingCommentsView(request):
    if request.method == 'POST':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'GET':
        try:
            comments = Comments.objects.filter(approved = False)
            serializer = CommentsSerializer(comments, many=True)
            toSend = serializer.data
            for i in toSend:
                serializer2 = ProductsSerializer(Products.objects.get(pid = i["pid"]))
                i["product"] = serializer2.data
                user = Users.objects.filter(uid = i["uid"])[0]
                i["username"] = user.user.username
            return Response({"comments": toSend})
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def ChangeCommentStatusView(request):
    if request.method == 'GET':
        return Response({}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == 'POST':
        try:
            response = ''
            comment = Comments.objects.filter(coid = request.data['coid'])[0]
            if request.data["status"] != "Approved":
                idd = comment.coid
                comment.delete()
                response = "Comment with coid " + str(idd) + " is deleted."

            else:
                comment.approved = True
                comment.save()
                idd = comment.coid
                product = comment.pid
                product.totalRating = product.totalRating + int(comment.rating)
                product.ratingCount = product.ratingCount + 1
                product.save()
                response = "Comment with coid " + str(idd) + " is approved successfully."

            comments = Comments.objects.filter(approved = False)
            serializer = CommentsSerializer(comments, many=True)
            toSend = serializer.data
            for i in toSend:
                serializer2 = ProductsSerializer(Products.objects.get(pid = i["pid"]))
                i["product"] = serializer2.data
                user = Users.objects.filter(uid = i["uid"])[0]
                i["username"] = user.user.username
            return Response({"success": response, "comments": toSend})
        except Exception as e:
            return Response({"error" : str(e)}, status = status.HTTP_400_BAD_REQUEST)
