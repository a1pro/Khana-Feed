// components/CustomModal.tsx

import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';

interface Props {
  visible: boolean;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

const DelearModal: React.FC<Props> = ({ visible, options, selected, onSelect, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                selected === option && styles.selectedItem,
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DelearModal

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
    width: 200,
  },
  optionItem: {
    paddingVertical: 12,
  },
  selectedItem: {
    backgroundColor: '#d2f0d2',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});
