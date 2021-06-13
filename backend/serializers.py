from rest_framework import serializers
from .models import *

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        #fields = ('uid', 'name', 'surname', 'role', 'taxID', 'email')
        fields = '__all__'

class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'
        #fields = ('pid', 'name', 'material', 'color', 'stock', 'warranty', 'price', 'description', 'caid')

    def create(self, validated_data):
        return Products.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.material = validated_data.get('material', instance.material)
        instance.productionCost = validated_data.get('productionCost', instance.productionCost)
        instance.color = validated_data.get('color', instance.color)
        instance.stock = validated_data.get('stock', instance.stock)
        instance.warranty = validated_data.get('warranty', instance.warranty)
        instance.price = validated_data.get('price', instance.price)
        instance.description = validated_data.get('description', instance.description)
        instance.caid = validated_data.get('caid', instance.caid)
        instance.did = validated_data.get('did', instance.did)
        instance.image = validated_data.get('image', instance.image)

        instance.save()
        return instance

class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = '__all__'
    def create(self, validated_data):
        return Comments.objects.create(**validated_data)
"""
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.body = validated_data.get('body', instance.body)
        instance.author_id = validated_data.get('author_id', instance.author_id)

        instance.save()
        return instance"""

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

    def create(self, validated_data):
        return Cart.objects.create(**validated_data)

class OrderHasProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderHasProducts
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'
class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefundRequest
        fields = '__all__'
