import React from 'react';
import { Device } from 'react-native-ble-plx';
import styled, { css } from 'styled-components';
import { Text, TouchableOpacity, View } from 'react-native';
export const DropDown = styled(View)`
  z-index: 100;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000066;
  align-items: center;
  justify-content: center;
`;
export type BleDeviceProps = {
  onPress: (device: Device) => void;
  device: Device;
};
export type DevicePropertyProps = {
  name: string;
  value?: number | string | null;
};
export const StyledText = styled(Text)`
  ${({ theme }) => css`
    font-size: ${theme.sizes.defaultFontSize}px;
    font-weight: 800;
  `}
`;
export const ContainerDeviceProperty = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const StyledTitleText = styled(StyledText)`
  font-weight: 800;
`;

export const StyledValueText = styled(StyledText)`
  font-weight: 500;
`;
export function DeviceProperty({ name, value }: DevicePropertyProps) {
  return (
    <ContainerDeviceProperty>
      <StyledTitleText>{name}:</StyledTitleText>
      <StyledValueText>{value || '-'}</StyledValueText>
    </ContainerDeviceProperty>
  );
}
export const Container = styled(TouchableOpacity)`
  ${({ theme }) => css`
    border-color: ${theme.colors.mainRed};
    border-width: 1px;
    padding: 12px;
    border-radius: 12px;
    margin-top: 12px;
  `}
`;
export function BleDevice({ device, onPress }: BleDeviceProps) {
  const isConnectableInfoValueIsUnavailable =
    typeof device.isConnectable !== 'boolean';
  const isConnectableValue = device.isConnectable ? 'ture' : 'false';
  const parsedIsConnectable = isConnectableInfoValueIsUnavailable
    ? '-'
    : isConnectableValue;

  return (
    <Container onPress={() => onPress(device)}>
      <DeviceProperty name="name" value={device.name} />
      <DeviceProperty name="localName" value={device.localName} />
      <DeviceProperty name="id" value={device.id} />
      <DeviceProperty name="manufacturerData" value={device.manufacturerData} />
      <DeviceProperty name="rawScanRecord" value={device.rawScanRecord} />
      <DeviceProperty name="isConnectable" value={parsedIsConnectable} />
      <DeviceProperty name="mtu" value={device.mtu.toString()} />
      <DeviceProperty name="rssi" value={device.rssi} />
    </Container>
  );
}
