import { FC } from "react";

export type Position = 'top' | 'bottom';

export interface MessageProps {
    style?: React.CSSProperties;
    position?: Position;
    className?: string | string[];
    content?: React.ReactNode;
    duration?: number;
    id?: number;
}

export const MessageProvider: FC<{}> = (props) => {
    return (
        <div></div>
    )
}