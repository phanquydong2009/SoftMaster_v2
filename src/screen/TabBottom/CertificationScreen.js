import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import ToolBar from '../../component/ToolBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../../stylesTabBottom/CertificationScreenStyles';
import BASE_URL from '../../component/apiConfig';

const CertificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userID } = route.params || {};
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`${BASE_URL}/certificate/getbyuserID/${userID}`);
        const data = await response.json();
        setCertificates(data.certificates || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      fetchCertificates();
    }
  }, [userID]);

  const handleCert = () => {
    console.log('truyền đi userID:', userID);
    navigation.navigate('Cert', { userID });
  };

  const PersonalBrandingCard = ({ name, sub, image }) => {
    return (
      <View style={styles.container2}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>Hoàn thành ngày : {sub}</Text>
          <TouchableOpacity style={styles.button} onPress={handleCert}>
            <Text style={styles.buttonText}>Xem</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <PersonalBrandingCard
      name={item.courseID?.name}
      sub={item.updatedAt.split('T')[0]}
      image={item.courseID?.img}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ToolBar title={'Chứng chỉ'} />
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ToolBar title={'Chứng chỉ'} />
      <FlatList
        data={certificates}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CertificationScreen;