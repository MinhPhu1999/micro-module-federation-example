import { type ReactNode } from 'react';
export declare function I18nProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useI18n(): {
    t: import("i18next").TFunction<"translation", undefined>;
    locale: string;
    setLocale: (locale: string) => void;
};
