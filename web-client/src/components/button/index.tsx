"use client";

import Link from "next/link";
import React from "react";

export default function Button({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  background: string;
  href?: string;
}) {
  if (props.href)
    return (
      <div className={props.background}>
        <Link className={props.className} href={props.href}>
          {props.children}
        </Link>
      </div>
    );

  return (
    <div className={props.background}>
      <button {...props}>{props.children}</button>
    </div>
  );
}
