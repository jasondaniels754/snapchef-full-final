import { Recipe } from './recipe';

export interface RecipeModalProps {
  recipe: Recipe | null;
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export interface ModalBackdropProps {
  visible: boolean;
  onPress: () => void;
}

export interface ModalContentProps {
  recipe: Recipe;
  onSave?: () => void;
  isSaved?: boolean;
  onClose: () => void;
}

export interface ModalAnimationState {
  isVisible: boolean;
  isAnimating: boolean;
  scale: number;
  translateY: number;
  opacity: number;
}

export interface ModalGestureState {
  isDragging: boolean;
  translateY: number;
  velocity: number;
} 