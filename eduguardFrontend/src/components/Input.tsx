import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const Input = ({ label, error, iconName, isPassword, ...rest }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text> : null}
      
      <View style={[styles.inputContainer, isFocused && styles.inputFocused, error && styles.inputError]}>
        {iconName && (
          <Ionicons 
            name={iconName} 
            size={22} 
            color={isFocused ? '#0284C7' : '#94A3B8'} 
            style={styles.leftIcon} 
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholderTextColor="#94A3B8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword ? isPasswordHidden : rest.secureTextEntry}
          {...rest}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordHidden(!isPasswordHidden)}
            style={styles.rightIcon}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isPasswordHidden ? "eye-off-outline" : "eye-outline"} 
              size={22} 
              color="#94A3B8" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '700',
    paddingLeft: 4,
  },
  labelFocused: {
    color: '#0284C7',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 24,
    height: 60,
    paddingHorizontal: 20,
  },
  inputFocused: {
    borderColor: '#0284C7',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 10px rgba(2, 132, 199, 0.15)',
      },
      default: {
        shadowColor: '#0284C7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
    }),
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
    paddingLeft: 4,
  },
});
