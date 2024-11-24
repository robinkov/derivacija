import { flushSync } from 'react-dom'
import * as Router from 'react-router-dom'

type Animation = {
  animation: 'swipe-right' | 'swipe-left' | 'zoom-in' | 'zoom-out'
};

type Navigation = (navigate: Router.NavigateFunction) => (to: Router.To, options?: Router.NavigateOptions & Animation) => void;

/**
 * Custom hook to handle navigation with optional animations within the context of React Router.
 * @param to - The path to navigate to.
 * @param [animation] - The CSS class name for the animation to apply during navigation.
 *                      If provided, this class is temporarily added to the 
 *                      `<html>` element during the view transition.
 * @param [options] - Additional options for navigation.
 * @throws Throws an error if used outside the context of React Router
 * @example
 * ```javascript
 * import * as Router from 'react-router-dom';
 * const navigation = useNavigation(Router.useNavigate());
 * // Basic usage with animation:
 * navigation('/home', 'fade-transition', { replace: true });
 * // Basic usage without animation:
 * navigation('/home', null, { replace: true });
 * ```
 * CSS example for animation:
 * ```css
 * .fade-transition::view-transition-old(root),
 * .fade-transition::view-transition-new(root) {
 *     animation: fade-transition 200ms ease-in-out;
 * }
 * ```
 */
export const useNavigation: Navigation = (navigate: Router.NavigateFunction) => {
  return (to, options) => {

    if (document.location.pathname == to) return;
    
    if (!document.startViewTransition || options?.viewTransition === false) {
      navigate(to, options);
      return;
    }

    options?.animation && document.documentElement.classList.add(options.animation);
    
    // document.startViewTransition requires synchronous DOM modifications
    // to create a diff, so we need to flush any updates synchronously
    document.startViewTransition(() => flushSync(() => navigate(to, options)))
      .finished.finally(() => {
        options?.animation && document.documentElement.classList.remove(options.animation);
      });
  }
}
