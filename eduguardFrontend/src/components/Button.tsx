import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, ViewStyle, View, Platform } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: ViewStyle;
}

const colors = {
  primary: '#0284C7',
  secondary: '#34D399',
  outlineText: '#0284C7',
};

export const Button = ({ title, loading, variant = 'primary', style, ...rest }: ButtonProps) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'ghost':
        return styles.ghost;
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return styles.textOutline;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, getButtonStyle(), style, rest.disabled && styles.disabled]}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={styles.innerContent}>
        {loading ? (
          <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'} size="small" />
        ) : (
          <Text style={[styles.text, getTextStyle()]}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: '#0284C7',
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 12px rgba(2, 132, 199, 0.35)',
      },
      default: {
        shadowColor: '#0284C7',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  secondary: {
    backgroundColor: '#34D399',
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 10px rgba(16, 185, 129, 0.3)',
      },
      default: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0284C7',
  },
  ghost: {
    backgroundColor: 'transparent',
    height: 48,
  },
  disabled: {
    opacity: 0.6,
    ...Platform.select({
      web: {
        boxShadow: 'none',
      },
      default: {
        shadowOpacity: 0,
        elevation: 0,
      },
    }),
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: '#0284C7',
  },
});
