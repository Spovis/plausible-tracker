import { sendEvent } from './request';
/**
 * Initializes the tracker with your default values.
 *
 * ### Example (es module)
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { enableAutoPageviews, trackEvent } = Plausible({
 *   domain: 'my-app-domain.com',
 *   hashMode: true
 * })
 *
 * enableAutoPageviews()
 *
 * function onUserRegister() {
 *   trackEvent('register')
 * }
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var Plausible = require('plausible-tracker');
 *
 * var { enableAutoPageviews, trackEvent } = Plausible({
 *   domain: 'my-app-domain.com',
 *   hashMode: true
 * })
 *
 * enableAutoPageviews()
 *
 * function onUserRegister() {
 *   trackEvent('register')
 * }
 * ```
 *
 * @param defaults - Default event parameters that will be applied to all requests.
 */
export default function Plausible(defaults) {
    const modifyWindow = () => {
        // eslint-disable-next-line functional/immutable-data
        window.plausible = trackEvent;
    };
    const getConfig = () => ({
        hashMode: false,
        trackLocalhost: false,
        url: location.href,
        domain: location.hostname,
        referrer: document.referrer || null,
        deviceWidth: window.innerWidth,
        apiHost: 'https://plausible.io',
        ...defaults,
    });
    const trackEvent = (eventName, options, eventData, sendWithBeacon = false) => {
        sendEvent(eventName, { ...getConfig(), ...eventData }, options, sendWithBeacon);
    };
    modifyWindow();
    const trackPageview = (eventData, options) => {
        trackEvent('pageview', options, eventData);
    };
    const enableAutoPageviews = () => {
        const page = () => trackPageview();
        // Attach pushState and popState listeners
        const originalPushState = history.pushState;
        if (originalPushState) {
            // eslint-disable-next-line functional/immutable-data
            history.pushState = function (data, title, url) {
                originalPushState.apply(this, [data, title, url]);
                page();
            };
            addEventListener('popstate', page);
        }
        // Attach hashchange listener
        if (defaults && defaults.hashMode) {
            addEventListener('hashchange', page);
        }
        // Trigger first page view
        trackPageview();
        return function cleanup() {
            if (originalPushState) {
                // eslint-disable-next-line functional/immutable-data
                history.pushState = originalPushState;
                removeEventListener('popstate', page);
            }
            if (defaults && defaults.hashMode) {
                removeEventListener('hashchange', page);
            }
        };
    };
    const enableAutoOutboundTracking = (targetNode = document, observerInit = {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['href'],
    }) => {
        function trackClick(event) {
            trackEvent('Outbound Link: Click', { props: { url: this.href } }, {}, true);
            if (!(
            // @ts-ignore
            typeof process !== 'undefined' &&
                // @ts-ignore
                process &&
                // @ts-ignore
                process.env.NODE_ENV === 'test')) {
                setTimeout(() => {
                    // eslint-disable-next-line functional/immutable-data
                    location.href = this.href;
                }, 150);
            }
            event.preventDefault();
        }
        // eslint-disable-next-line functional/prefer-readonly-type
        const tracked = new Set();
        function addNode(node) {
            if (node instanceof HTMLAnchorElement) {
                if (node.host !== location.host) {
                    node.addEventListener('click', trackClick);
                    tracked.add(node);
                }
            } /* istanbul ignore next */
            else if ('querySelectorAll' in node) {
                node.querySelectorAll('a').forEach(addNode);
            }
        }
        function removeNode(node) {
            if (node instanceof HTMLAnchorElement) {
                node.removeEventListener('click', trackClick);
                tracked.delete(node);
            } /* istanbul ignore next */
            else if ('querySelectorAll' in node) {
                node.querySelectorAll('a').forEach(removeNode);
            }
        }
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    // Handle changed href
                    removeNode(mutation.target);
                    addNode(mutation.target);
                } /* istanbul ignore next */
                else if (mutation.type === 'childList') {
                    // Handle added nodes
                    mutation.addedNodes.forEach(addNode);
                    // Handle removed nodes
                    mutation.removedNodes.forEach(removeNode);
                }
            });
        });
        // Track existing nodes
        targetNode.querySelectorAll('a').forEach(addNode);
        // Observe mutations
        observer.observe(targetNode, observerInit);
        return function cleanup() {
            tracked.forEach((a) => {
                a.removeEventListener('click', trackClick);
            });
            tracked.clear();
            observer.disconnect();
        };
    };
    return {
        trackEvent,
        trackPageview,
        enableAutoPageviews,
        enableAutoOutboundTracking,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdHJhY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQXFMcEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9DRztBQUVILE1BQU0sQ0FBQyxPQUFPLFVBQVUsU0FBUyxDQUMvQixRQUErQjtJQU8vQixNQUFNLFlBQVksR0FBRyxHQUFHLEVBQUU7UUFDeEIscURBQXFEO1FBQ3JELE1BQU0sQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUMsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLEdBQStCLEVBQUUsQ0FBQyxDQUFDO1FBQ25ELFFBQVEsRUFBRSxLQUFLO1FBQ2YsY0FBYyxFQUFFLEtBQUs7UUFDckIsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxRQUFRLENBQUMsUUFBUTtRQUN6QixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsSUFBSSxJQUFJO1FBQ25DLFdBQVcsRUFBRSxNQUFNLENBQUMsVUFBVTtRQUM5QixPQUFPLEVBQUUsc0JBQXNCO1FBQy9CLEdBQUcsUUFBUTtLQUNaLENBQUMsQ0FBQztJQUVILE1BQU0sVUFBVSxHQUFlLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsY0FBYyxHQUFHLEtBQUssRUFBRSxFQUFFO1FBQ3ZGLFNBQVMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxHQUFHLFNBQVMsRUFBRSxFQUFFLEdBQUcsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ2xGLENBQUMsQ0FBQztJQUVGLFlBQVksRUFBRSxDQUFDO0lBRWYsTUFBTSxhQUFhLEdBQWtCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQzFELFVBQVUsQ0FBQyxVQUFVLEVBQUUs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