'use client';

import React, { useState, useMemo } from 'react';
import { CheckCheck, Eye, EyeOff, Info, X } from 'lucide-react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';

// Constants
const PASSWORD_REQUIREMENTS = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[0-9]/, text: 'At least 1 number' },
    { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
    { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    { regex: /[!-\/:-@[-`{-~]/, text: 'At least 1 special character' },
] as const;

type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5;

const STRENGTH_CONFIG = {
    colors: {
        0: 'text-red-500',
        1: 'text-orange-500',
        2: 'text-yellow-500',
        3: 'text-green-500',
        4: 'text-amber-700',
        5: 'text-emerald-500',
    } satisfies Record<StrengthScore, string>,
} as const;

// Types
type Requirement = {
    met: boolean;
    text: string;
};

type PasswordStrength = {
    score: StrengthScore;
    requirements: Requirement[];
};

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    showStrength?: boolean;
    label?: string;
    className?: string;
}

export default function PasswordInput({
    value,
    onChange,
    showStrength = true,
    label,
    className,
    ...props
}: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    const calculateStrength = useMemo((): PasswordStrength => {
        const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
            met: req.regex.test(value),
            text: req.text,
        }));

        return {
            score: requirements.filter((req) => req.met).length as StrengthScore,
            requirements,
        };
    }, [value]);

    return (
        <div className={cn("w-full", className)}>
            <div className='flex justify-between mb-2'>
                {label && (
                    <label htmlFor={props.id} className='block text-sm font-medium text-gray-300'>
                        {label}
                    </label>
                )}
                {showStrength && (
                    <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                            <Info
                                size={16}
                                className={cn(
                                    "cursor-pointer transition-all",
                                    STRENGTH_CONFIG.colors[calculateStrength.score]
                                )}
                            />
                        </HoverCardTrigger>
                        <HoverCardContent className='w-80 bg-[#0A0A0A] border border-white/10 text-white shadow-xl'>
                            <ul className='space-y-2' aria-label='Password requirements'>
                                {calculateStrength.requirements.map((req, index) => (
                                    <li key={index} className='flex items-center space-x-2'>
                                        {req.met ? (
                                            <CheckCheck size={14} className='text-emerald-500' />
                                        ) : (
                                            <X size={14} className='text-muted-foreground/80' />
                                        )}
                                        <span
                                            className={cn(
                                                "text-xs",
                                                req.met ? 'text-emerald-400' : 'text-muted-foreground'
                                            )}
                                        >
                                            {req.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </HoverCardContent>
                    </HoverCard>
                )}
            </div>
            <div className='relative'>
                <input
                    type={isVisible ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    aria-invalid={calculateStrength.score < 4}
                    aria-describedby='password-strength'
                    className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-none focus-visible:ring-0",
                        props.disabled && "opacity-50 cursor-not-allowed"
                    )}
                    {...props}
                />
                <button
                    type='button'
                    onClick={() => setIsVisible((prev) => !prev)}
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg'
                    tabIndex={-1}
                >
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            {showStrength && (
                <div className='flex gap-1.5 w-full justify-between mt-3'>
                    {[1, 2, 3, 4, 5].map((level) => (
                        <span
                            key={level}
                            className={cn(
                                "h-1 rounded-full w-full transition-all duration-300",
                                calculateStrength.score >= level
                                    ? (
                                        level === 1 ? 'bg-red-500' :
                                            level === 2 ? 'bg-orange-500' :
                                                level === 3 ? 'bg-yellow-500' :
                                                    level === 4 ? 'bg-blue-500' :
                                                        'bg-emerald-500'
                                    )
                                    : 'bg-white/5'
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
