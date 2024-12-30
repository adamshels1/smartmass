import React, {useState, useRef, FC} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import POPULAR_PRODUCTS from './popularProducts';
import {CloseIcon} from 'shared/assets/icons';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';

const API_KEY = '5caad6e3cb8a4ca79839cad59c1fa946';

interface TagsInputProps {
  label?: string;
  placeholder?: string;
  value?: string[];
  onChange?: (tags: string[]) => void;
  onAddTag?: (tag: string) => void;
  isVisibleTags?: boolean;
}

const TagsInput: FC<TagsInputProps> = ({
  label = 'Теги',
  placeholder = 'Добавить тег',
  value = [],
  onChange,
  onAddTag,
  isVisibleTags = true,
}) => {
  const [tags, setTags] = useState<string[]>(value);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/autocomplete?query=${query}&number=10&apiKey=${API_KEY}`,
      );
      const apiSuggestions = response.data.map((item: any) => item.name);
      const combinedSuggestions = [
        ...new Set([
          ...POPULAR_PRODUCTS.filter(tag =>
            tag.toLowerCase().includes(query.toLowerCase()),
          ),
          ...apiSuggestions,
        ]),
      ];
      setSuggestions(combinedSuggestions);
    } catch (error) {
      console.error(error);
    }
  };

  const addTag = (tag: string) => {
    if (tags.includes(tag)) {
      setInput('');
      setSuggestions([]);
      return;
    }
    if (tag && !tags.includes(tag)) {
      onAddTag && onAddTag(tag);
      const newTags = [...tags, tag];
      setTags(newTags);
      setInput('');
      setSuggestions([]);
      setTimeout(() => inputRef.current?.focus(), 100);
      if (onChange) {
        onChange(newTags);
      }
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    if (onChange) {
      onChange(newTags);
    }
  };

  const handleInputChange = (text: string) => {
    setInput(text);
    if (text.length > 0) {
      fetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        value={input}
        onChangeText={handleInputChange}
        onSubmitEditing={() => addTag(input)}
        placeholder={placeholder}
        style={styles.input}
        autoCapitalize={'none'}
      />
      {isVisibleTags && (
        <ScrollView
          contentContainerStyle={styles.tagsContainer}
          keyboardShouldPersistTaps="handled"
          horizontal={false}>
          <View style={styles.tagsWrapper}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                onPress={() => removeTag(index)}
                key={index}
                style={styles.tag}>
                <Text style={{fontSize: 16}}>{tag}</Text>
                <TouchableOpacity
                  onPress={() => removeTag(index)}
                  style={{marginLeft: 5}}>
                  <CloseIcon width={13} height={13} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <FlatList
        style={{maxHeight: 300}}
        data={suggestions}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => addTag(item)}>
            <CustomText style={styles.suggestion}>{item}</CustomText>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    paddingLeft: 10,
    flexDirection: 'row',
    backgroundColor: '#D7E7F6',
    padding: 5,
    paddingHorizontal: 10,
    margin: 3,
    borderRadius: 33,
    alignItems: 'center',
  },
  removeTag: {
    marginLeft: 5,
    color: 'red',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 33,
    backgroundColor: '#fff',
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#3d3d3d',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#000',
  },
});

export default TagsInput;
