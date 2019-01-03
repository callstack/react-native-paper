import * as React from 'react';
import { ThemeShape } from '../types';

export interface PlusMinusCounterProps {
    quantity: number;
    onChangeCounter: (number) => any;
}

export interface PlusMinusCounterState {
    quantity: number;
}

export declare class PlusMinusCounter extends React.Component<PlusMinusCounterProps, PlusMinusCounterState> {}
