'use client'

import { useSelector } from "react-redux";
import { selectContentStatus } from "@/state/content/contentSlice";

type RequireContentProps = {
  element: React.ReactNode,
  fallbackElement?: React.ReactNode,
  loadingElement?: React.ReactNode
}

export default function RequireContent({
  element, fallbackElement, loadingElement
}: RequireContentProps) {
  const { isLoading, isError } = useSelector(selectContentStatus);

  return isLoading ? loadingElement : isError ? fallbackElement : element;
}
