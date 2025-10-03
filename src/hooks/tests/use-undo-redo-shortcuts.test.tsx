import { useUndoRedoShortcuts } from '@/hooks/use-undo-redo-shortcuts';
import { renderHook } from '@testing-library/react';

describe('useUndoRedoShortcuts', () => {
  let mockUndo: jest.Mock<void, [number?]>;
  let mockRedo: jest.Mock<void, [number?]>;

  beforeEach(() => {
    mockUndo = jest.fn();
    mockRedo = jest.fn();
  });

  afterEach(() => {
    // Clean up any event listeners
    jest.clearAllMocks();
  });

  const createKeyboardEvent = (
    key: string,
    options: Partial<KeyboardEventInit> = {},
  ): KeyboardEvent =>
    new KeyboardEvent('keydown', {
      key,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      ...options,
    });

  it('should call undo when Ctrl+Z is pressed', () => {
    renderHook(() => useUndoRedoShortcuts(mockUndo, mockRedo));

    const event = createKeyboardEvent('z', { ctrlKey: true });
    document.dispatchEvent(event);

    expect(mockUndo).toHaveBeenCalledTimes(1);
    expect(mockUndo).toHaveBeenCalledWith();
    expect(mockRedo).not.toHaveBeenCalled();
  });

  it('should call undo when Cmd+Z is pressed (Mac)', () => {
    renderHook(() => useUndoRedoShortcuts(mockUndo, mockRedo));

    const event = createKeyboardEvent('z', { metaKey: true });
    document.dispatchEvent(event);

    expect(mockUndo).toHaveBeenCalledTimes(1);
    expect(mockUndo).toHaveBeenCalledWith();
    expect(mockRedo).not.toHaveBeenCalled();
  });

  it('should call redo when Ctrl+Y is pressed', () => {
    renderHook(() => useUndoRedoShortcuts(mockUndo, mockRedo));

    const event = createKeyboardEvent('y', { ctrlKey: true });
    document.dispatchEvent(event);

    expect(mockRedo).toHaveBeenCalledTimes(1);
    expect(mockRedo).toHaveBeenCalledWith();
    expect(mockUndo).not.toHaveBeenCalled();
  });

  it('should call redo when Ctrl+Shift+Z is pressed', () => {
    renderHook(() => useUndoRedoShortcuts(mockUndo, mockRedo));

    const event = createKeyboardEvent('z', { ctrlKey: true, shiftKey: true });
    document.dispatchEvent(event);

    expect(mockRedo).toHaveBeenCalledTimes(1);
    expect(mockRedo).toHaveBeenCalledWith();
    expect(mockUndo).not.toHaveBeenCalled();
  });

  it('should call redo when Cmd+Shift+Z is pressed (Mac)', () => {
    renderHook(() => useUndoRedoShortcuts(mockUndo, mockRedo));

    const event = createKeyboardEvent('z', { metaKey: true, shiftKey: true });
    document.dispatchEvent(event);

    expect(mockRedo).toHaveBeenCalledTimes(1);
    expect(mockRedo).toHaveBeenCalledWith();
    expect(mockUndo).not.toHaveBeenCalled();
  });

  it('should not call functions when modifier keys are not pressed', () => {
    renderHook(() => useUndoRedoShortcuts(mockUndo, mockRedo));

    const zEvent = createKeyboardEvent('z');
    const yEvent = createKeyboardEvent('y');

    document.dispatchEvent(zEvent);
    document.dispatchEvent(yEvent);

    expect(mockUndo).not.toHaveBeenCalled();
    expect(mockRedo).not.toHaveBeenCalled();
  });

  it('should not call functions for other keys with modifiers', () => {
    renderHook(() => useUndoRedoShortcuts(mockUndo, mockRedo));

    const event = createKeyboardEvent('a', { ctrlKey: true });
    document.dispatchEvent(event);

    expect(mockUndo).not.toHaveBeenCalled();
    expect(mockRedo).not.toHaveBeenCalled();
  });

  it('should prevent default behavior for handled shortcuts', () => {
    renderHook(() => useUndoRedoShortcuts(mockUndo, mockRedo));

    const undoEvent = createKeyboardEvent('z', { ctrlKey: true });
    const redoEvent = createKeyboardEvent('y', { ctrlKey: true });

    const undoPreventDefault = jest.spyOn(undoEvent, 'preventDefault');
    const redoPreventDefault = jest.spyOn(redoEvent, 'preventDefault');

    document.dispatchEvent(undoEvent);
    document.dispatchEvent(redoEvent);

    expect(undoPreventDefault).toHaveBeenCalled();
    expect(redoPreventDefault).toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useUndoRedoShortcuts(mockUndo, mockRedo),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should update event listener when callbacks change', () => {
    const newMockUndo: jest.Mock<void, [number?]> = jest.fn();
    const newMockRedo: jest.Mock<void, [number?]> = jest.fn();

    const { rerender } = renderHook(
      ({
        undo,
        redo,
      }: {
        undo: (steps?: number) => void;
        redo: (steps?: number) => void;
      }) => useUndoRedoShortcuts(undo, redo),
      {
        initialProps: { undo: mockUndo, redo: mockRedo },
      },
    );

    // Test with initial callbacks
    const event1 = createKeyboardEvent('z', { ctrlKey: true });
    document.dispatchEvent(event1);
    expect(mockUndo).toHaveBeenCalledTimes(1);

    // Update callbacks
    rerender({ undo: newMockUndo, redo: newMockRedo });

    // Test with new callbacks
    const event2 = createKeyboardEvent('z', { ctrlKey: true });
    document.dispatchEvent(event2);
    expect(newMockUndo).toHaveBeenCalledTimes(1);
    expect(mockUndo).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it('should handle multiple simultaneous modifier keys correctly', () => {
    renderHook(() => useUndoRedoShortcuts(mockUndo, mockRedo));

    // Ctrl+Alt+Z should still trigger undo
    const event = createKeyboardEvent('z', { ctrlKey: true, altKey: true });
    document.dispatchEvent(event);

    expect(mockUndo).toHaveBeenCalledTimes(1);
  });
});
