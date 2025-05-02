import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import {PrimaryColor, windowWidth} from '../../../tools/Constant/Constant';

const CELL_COUNT = 6;

const SetPin = prop => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (!prop.confirmPin) prop.setFirstPin(value);
    else prop.setConfirmPin(value);

    // auto focus
    if (prop.focus === true) {
      setTimeout(() => {
        ref.current.focus();
      }, 100);
    }
  }, [value]);

  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="•"
          isLastFilledCell={isLastFilledCell({value, index})}>
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor cursorSymbol="" />;
    }

    return (
      <Text
        key={index}
        style={{
          width: windowWidth <= 320 ? 38 : 46,
          height: 45,
          lineHeight: 40,
          fontSize: 20,
          borderWidth: isFocused ? 2 : 2,
          borderRadius: 10,
          borderColor: isFocused ? '#edf3f4' : '#edf3f4',
          textAlign: 'center',
          textAlignVertical: 'center',
          backgroundColor: isFocused ? '#edf3f4' : '#fff',
          overflow: 'hidden',
          color: isFocused ? PrimaryColor : '#000',
        }}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };
  return (
    <CodeField
      ref={ref}
      {...props}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      keyboardType="phone-pad"
      textContentType="oneTimeCode"
      renderCell={renderCell}
      value={value}
    />
  );
};

export default SetPin;
