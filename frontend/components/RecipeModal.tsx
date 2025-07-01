import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { RecipeModalProps, ModalAnimationState } from '../types/modal';
import ModalBackdrop from './ModalBackdrop';
import ModalContent from './ModalContent';

export default function RecipeModal({ 
  recipe, 
  visible, 
  onClose, 
  onSave, 
  isSaved 
}: RecipeModalProps): React.ReactElement | null {
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacityAnim = useRef(new Animated.Value(0)).current;

  // Animation state
  const [animationState, setAnimationState] = useState<ModalAnimationState>({
    isVisible: false,
    isAnimating: false,
    scale: 0,
    translateY: 300,
    opacity: 0,
  });

  // Pan gesture handler
  const panGestureEvent = useRef(
    Animated.event(
      [{ nativeEvent: { translationY: translateYAnim } }],
      { useNativeDriver: true }
    )
  ).current;

  // Animation functions
  const animateIn = () => {
    console.log('🎬 Starting modal animation IN');
    setAnimationState(prev => ({ ...prev, isAnimating: true }));

    const animations = [
      Animated.parallel([
        Animated.timing(backdropOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ];

    Animated.sequence(animations).start(() => {
      console.log('✅ Modal animation IN completed');
      setAnimationState(prev => ({ 
        ...prev, 
        isAnimating: false, 
        isVisible: true,
        scale: 1,
        translateY: 0,
        opacity: 1,
      }));
    });
  };

  const animateOut = () => {
    console.log('🎬 Starting modal animation OUT');
    setAnimationState(prev => ({ ...prev, isAnimating: true }));

    const animations = [
      Animated.parallel([
        Animated.timing(backdropOpacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ];

    Animated.sequence(animations).start(() => {
      console.log('✅ Modal animation OUT completed');
      setAnimationState(prev => ({ 
        ...prev, 
        isAnimating: false, 
        isVisible: false,
        scale: 0,
        translateY: 300,
        opacity: 0,
      }));
      onClose();
    });
  };

  // Handle pan gesture state changes
  const onPanGestureEvent = (event: any) => {
    const { state, translationY, velocityY } = event.nativeEvent;
    
    if (state === State.END) {
      const shouldClose = translationY > 100 || velocityY > 500;
      
      if (shouldClose) {
        console.log('👆 Pan gesture triggered close');
        animateOut();
      } else {
        // Snap back to original position
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  // Effect to handle visibility changes
  useEffect(() => {
    console.log('🔄 Modal visibility changed:', { visible, recipe: !!recipe });
    
    if (visible && recipe) {
      // Reset animation values
      scaleAnim.setValue(0);
      translateYAnim.setValue(300);
      opacityAnim.setValue(0);
      backdropOpacityAnim.setValue(0);
      
      // Start animation after a small delay
      setTimeout(() => {
        animateIn();
      }, 50);
    } else if (!visible && animationState.isVisible) {
      animateOut();
    }
  }, [visible, recipe]);

  // Don't render if not visible and not animating
  if (!visible && !animationState.isAnimating) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdropContainer, { opacity: backdropOpacityAnim }]}>
        <ModalBackdrop visible={true} onPress={animateOut} />
      </Animated.View>

      {/* Modal Content */}
      <PanGestureHandler
        onGestureEvent={panGestureEvent}
        onHandlerStateChange={onPanGestureEvent}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: translateYAnim },
              ],
            },
          ]}
        >
          <ModalContent
            recipe={recipe!}
            onSave={onSave}
            isSaved={isSaved}
            onClose={animateOut}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 