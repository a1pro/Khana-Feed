import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import COLORS from '../utils/Colors';
import ENDPOINTS, { API_URL } from '../APIService/endPoints';
import IMAGES from '../assets/images';
import { getLocalStorageData } from '../utils/Storage';
import STORAGE_KEYS from '../utils/Constants';

const IMAGE_BASE_URL = 'https://warehouse.a1professionals.net/uploads/products/';
const DUMMY_IMAGE = IMAGES.feed;

interface Product {
  id: string;
  name: string;
  price: number;
  weight?: string;
  image?: string;
}

interface Props {
  customer: string;
  otherCustomer: string;
}

const PopularProducts: React.FC<Props> = ({ customer, otherCustomer }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [orderLoading, setOrderLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const token = await getLocalStorageData(STORAGE_KEYS.token);
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `${API_URL}${ENDPOINTS.getProduct}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = response.data;
        if (json.success && Array.isArray(json.data)) {
          const mappedProducts: Product[] = json.data.map((item: any) => ({
            id: item.id.toString(),
            name: item.note,
            price: item.price,
            weight: '',
            image: item.image ? IMAGE_BASE_URL + item.image : undefined,
          }));
          setProducts(mappedProducts);
          setSelectedProduct(mappedProducts[0] || null);
        } else {
          setError('Failed to fetch products');
        }
      } catch (e) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityIncrease = () => setQuantity(prev => prev + 1);
  const handleQuantityDecrease = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));

const handleOrderPlace = async () => {
  if (!selectedProduct || !selectedProduct.id || !selectedProduct.price || quantity <= 0) {
    Alert.alert('Error', 'Please select a product and enter a valid quantity.');
    return;
  }
  setOrderLoading(true);
  try {
    const token = await getLocalStorageData(STORAGE_KEYS.token);
    if (!token) return Alert.alert('Error', 'No token found');
    const payload = {
      customer: customer,
      other_customer: otherCustomer,
      product_id: [selectedProduct.id],     
      quantity: [quantity],                 
      price: [selectedProduct.price],       
    };

    console.log('data sent to api', payload);

    const response = await axios.post(
      `${API_URL}${ENDPOINTS.orderplace}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
      }

    );
    if (response.data && response.data.success) {
      Alert.alert('Success', 'Order placed successfully!');
      setQuantity(0);
    } else {
      Alert.alert('Error', response.data.message || 'Order failed.');
    }
  } catch  (error: any) {
    console.log('Order error:', error?.response?.data);
    Alert.alert('Error', error?.response?.data?.message || 'Order failed.');
  } finally {
    setOrderLoading(false);
  }
};




  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.appColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!selectedProduct) {
    return (
      <View style={styles.centered}>
        <Text>No products available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Popular Products</Text>
        <TouchableOpacity style={styles.addMoreButton}>
          <Text style={styles.addMoreText}>Add more</Text>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {products.map(product => (
          <TouchableOpacity
            key={product.id}
            onPress={() => {
              setSelectedProduct(product);
              setQuantity(0);
            }}
            style={[
              styles.productItem,
              selectedProduct.id === product.id && styles.selectedProduct,
            ]}
          >
            <Image
              source={product.image ? { uri: product.image } : DUMMY_IMAGE}
              style={styles.productImage}
              resizeMode="contain"
            />
            <Text style={styles.productLabel} numberOfLines={2}>
              {product.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.selectedProductContainer}>
        <Image
          source={selectedProduct.image ? { uri: selectedProduct.image } : DUMMY_IMAGE}
          style={styles.mainImage}
          resizeMode="contain"
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>{selectedProduct.name}</Text>
          <Text style={styles.price}>₹ {selectedProduct.price}</Text>
          <Text style={styles.weight}>{selectedProduct.weight || ''}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleOrderPlace}
            disabled={orderLoading}
          >
            {orderLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>

          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleQuantityDecrease} style={styles.plusButton}>
              <Text style={styles.plus}>-</Text>
            </TouchableOpacity>
            <TextInput
              value={quantity.toString()}
              keyboardType="numeric"
              onChangeText={(text: any) => setQuantity(Number(text) || 0)}
              placeholder="Quantity"
              style={styles.quantityInput}
            />
            <TouchableOpacity onPress={handleQuantityIncrease} style={styles.plusButton}>
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { fontSize: 18, fontWeight: '600' },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.appColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addMoreText: { color: '#fff', fontSize: 12, marginRight: 4 },
  plus: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  horizontalScroll: {
    marginTop: 12,
    marginBottom: 20,
  },
  productItem: {
    alignItems: 'center',
    marginRight: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 100,
  },
  selectedProduct: {
    borderColor: COLORS.appColor,
    backgroundColor: '#e6f0ff',
  },
  productImage: {
    width: 60,
    height: 60,
  },
  productLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  },
  selectedProductContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  mainImage: {
    width: '100%',
    height: 150,
    alignSelf: 'center',
  },
  detailsContainer: {
    marginTop: 12,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.appColor,
  },
  weight: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.appColor,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.appColor,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  quantityInput: {
    width: 60,
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 14,
  },
  plusButton: {
    backgroundColor: COLORS.appColor,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 4,
  },
});

export default PopularProducts;
