import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: any) { 
    return (
        <img 
            {...props} 
            src="/images/logo.png" 
            alt="ESCOM Logo" 
            className="h-20 w-auto object-contain" 
        />
    );
}
