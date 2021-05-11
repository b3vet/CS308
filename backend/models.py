from django.db import models
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.

class Users(models.Model):
    uid = models.AutoField(primary_key = True)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    taxID = models.CharField(max_length=100)
    email = models.CharField(max_length=50)
    phoneNumber = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    class Meta:
        db_table = "user"

MATERIAL_CHOICES = [
('18K GOLD','18K GOLD'),
('14K GOLD','14K GOLD'),
('10K GOLD','10K GOLD')
]

COLOR_CHOICES = [
('GOLD','GOLD'),
('SILVER','SILVER'),
('ROSE','ROSE')
]

class Category(models.Model):
    caid = models.AutoField(primary_key = True)
    categoryName = models.CharField(max_length=100)
    class Meta:
        db_table = "category"

class Discount(models.Model):
    did = models.AutoField(primary_key = True)
    startDateTime = models.DateTimeField(default=timezone.now)
    endDateTime = models.DateTimeField(default=timezone.now)
    ratio = models.IntegerField()
    class Meta:
        db_table = "discount"
        
class Products(models.Model):
    pid = models.AutoField(primary_key = True)
    name = models.CharField(max_length=100)
    material = models.CharField(max_length=200, choices=MATERIAL_CHOICES, default='18K GOLD')
    productionCost = models.IntegerField()
    color = models.CharField(max_length=200, choices=COLOR_CHOICES, default='GOLD')
    stock = models.IntegerField()
    warranty = models.IntegerField()
    price = models.IntegerField()
    description = models.TextField()
    caid = models.ForeignKey(Category, default = 9, on_delete = models.CASCADE, db_column = 'category')
    did = models.OneToOneField(Discount, default = None, on_delete=models.CASCADE,  db_column = 'discount', blank=True, null=True)
    totalRating = models.IntegerField(default = 0)
    ratingCount = models.IntegerField(default = 0)
    image = models.FileField(default = None, blank=True, null=True)
    class Meta:
        db_table = "products"

class Cart(models.Model):
    cartid = models.AutoField(primary_key = True)
    quantity = models.IntegerField()
    uid = models.ForeignKey(Users, default=1, on_delete=models.CASCADE,  db_column = 'users')
    pid = models.ForeignKey(Products, default=1, on_delete=models.CASCADE,  db_column = 'products')

    class Meta:
        db_table = "cart"


class Order(models.Model):
    oid = models.AutoField(primary_key = True)
    date = models.DateTimeField()
    deliveryAddress = models.TextField()
    uid = models.ForeignKey(Users, default = 1, on_delete = models.CASCADE, db_column = 'users')
    
    class Meta:
        db_table = "order"

STATUS_CHOICES = [
('PROCESSING','Processing'),
('IN-TRANSIT','In-transit'),
('DELIVERED','Delivered'),
('CANCELED','Canceled'),
('RETURNED','Returned')
]

class OrderHasProducts(models.Model):
    ohid = models.AutoField(primary_key = True)
    status = models.CharField(max_length=200, choices=STATUS_CHOICES, default='PROCESSING')
    pid = models.ForeignKey(Products, default = 1, on_delete = models.CASCADE, db_column = 'products')
    oid = models.ForeignKey(Order, default = 1, on_delete = models.CASCADE, db_column = 'order')

    class Meta:
        db_table = "orderhasproducts"    

class RefundRequest(models.Model):
    rid = models.AutoField(primary_key = True)
    reason = models.TextField()
    approved = models.BooleanField()
    ohid = models.ForeignKey(OrderHasProducts, default=1, on_delete=models.CASCADE,  db_column = 'orderhasproducts')

    class Meta:
        db_table = "refundrequest"

class Invoice(models.Model):
    iid = models.AutoField(primary_key = True)
    fullName = models.CharField(max_length=100)
    paidAmount = models.IntegerField()
    address= models.TextField()
    date = models.DateTimeField(default=timezone.now)
    isActive = models.BooleanField()
    uid = models.ForeignKey(Users, default=1, on_delete=models.CASCADE,  db_column = 'users')
    oid = models.OneToOneField(Order, default=1, on_delete=models.CASCADE,  db_column = 'order')

    class Meta:
        db_table = "invoice"




RATING_CHOICES = [
(1, ''),
(2, ''),
(3, ''),
(4,''),
(5,'')
]

class Comments(models.Model):
    coid = models.AutoField(primary_key = True)
    comment = models.TextField( max_length = 200)
    rating = models.PositiveIntegerField( choices = RATING_CHOICES )
    approved = models.BooleanField()
    dateTimeAdded = models.DateTimeField(default=timezone.now, blank=True, null=False)
    pid = models.ForeignKey(Products, default = 1, on_delete = models.CASCADE, db_column = 'products')
    uid = models.ForeignKey(Users, default = 1, on_delete = models.CASCADE, db_column = 'user')
    class Meta:
        db_table = "comments"