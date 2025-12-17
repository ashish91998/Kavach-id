export interface SlideData {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  content: string[];
  highlightColor: string;
  stat?: {
    value: string;
    label: string;
  };
}

export interface CursorPosition {
  x: number;
  y: number;
}
