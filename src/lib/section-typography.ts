import React from 'react';

export interface SectionTypographyProps {
  headingFontFamily?: string;
  headingColor?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  headingLetterSpacing?: string;
  headingLineHeight?: string;
  headingTextTransform?: string;

  subtitleFontFamily?: string;
  subtitleColor?: string;
  subtitleFontSize?: string;
  subtitleFontWeight?: string;
  subtitleLetterSpacing?: string;
  subtitleLineHeight?: string;

  badgeFontFamily?: string;
  badgeColor?: string;
  badgeBgColor?: string;
  badgeFontSize?: string;
  badgeFontWeight?: string;
  badgeLetterSpacing?: string;
  badgeTextTransform?: string;

  btnFontFamily?: string;
  btnFontSize?: string;
  btnFontWeight?: string;
  btnLetterSpacing?: string;
  btnTextTransform?: string;

  primaryBtnColor?: string;
  primaryBtnTextColor?: string;
  secondaryBtnColor?: string;
  secondaryBtnTextColor?: string;
  tertiaryBtnColor?: string;
  tertiaryBtnTextColor?: string;

  textColor?: string;
}

export function getSectionTypographyStyles(props: SectionTypographyProps) {
  const headingStyle: React.CSSProperties = {
    fontFamily: props.headingFontFamily ? `"${props.headingFontFamily}", serif` : undefined,
    color: props.headingColor || props.textColor || undefined,
    fontSize: props.headingFontSize || undefined,
    fontWeight: props.headingFontWeight || undefined,
    letterSpacing: props.headingLetterSpacing || undefined,
    lineHeight: props.headingLineHeight || undefined,
    textTransform: (props.headingTextTransform as any) || undefined,
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: props.subtitleFontFamily ? `"${props.subtitleFontFamily}", sans-serif` : undefined,
    color: props.subtitleColor || (props.textColor ? `${props.textColor}cc` : undefined),
    fontSize: props.subtitleFontSize || undefined,
    fontWeight: props.subtitleFontWeight || undefined,
    letterSpacing: props.subtitleLetterSpacing || undefined,
    lineHeight: props.subtitleLineHeight || undefined,
  };

  const badgeStyle: React.CSSProperties = {
    fontFamily: props.badgeFontFamily ? `"${props.badgeFontFamily}", sans-serif` : undefined,
    color: props.badgeColor || undefined,
    backgroundColor: props.badgeBgColor || undefined,
    fontSize: props.badgeFontSize || undefined,
    fontWeight: props.badgeFontWeight || undefined,
    letterSpacing: props.badgeLetterSpacing || undefined,
    textTransform: (props.badgeTextTransform as any) || undefined,
  };

  const btnStyle: React.CSSProperties = {
    fontFamily: props.btnFontFamily ? `"${props.btnFontFamily}", sans-serif` : undefined,
    fontSize: props.btnFontSize || undefined,
    fontWeight: props.btnFontWeight || undefined,
    letterSpacing: props.btnLetterSpacing || undefined,
    textTransform: (props.btnTextTransform as any) || undefined,
  };

  const primaryBtnStyle: React.CSSProperties = {
    ...btnStyle,
    backgroundColor: props.primaryBtnColor || undefined,
    color: props.primaryBtnTextColor || undefined,
  };

  const secondaryBtnStyle: React.CSSProperties = {
    ...btnStyle,
    backgroundColor: props.secondaryBtnColor || undefined,
    color: props.secondaryBtnTextColor || undefined,
  };

  const tertiaryBtnStyle: React.CSSProperties = {
    ...btnStyle,
    backgroundColor: props.tertiaryBtnColor || undefined,
    color: props.tertiaryBtnTextColor || undefined,
  };

  return {
    headingStyle,
    subtitleStyle,
    badgeStyle,
    btnStyle,
    primaryBtnStyle,
    secondaryBtnStyle,
    tertiaryBtnStyle,
  };
}
