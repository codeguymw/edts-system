import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
};

export default function PrimaryButton({ className = '', disabled, children, ...props }: Props) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 bg-[#00853f] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-[#006430] focus:bg-[#006430] active:bg-[#005227] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
