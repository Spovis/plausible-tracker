"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
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
function Plausible(defaults) {
    const modifyWindow = () => {
        // eslint-disable-next-line functional/immutable-data
        window.plausible = trackEvent;
    };
    const getConfig = () => (Object.assign({ hashMode: false, trackLocalhost: false, url: location.href, domain: location.hostname, referrer: document.referrer || null, deviceWidth: window.innerWidth, apiHost: 'https://plausible.io' }, defaults));
    const trackEvent = (eventName, options, eventData, sendWithBeacon = false) => {
        request_1.sendEvent(eventName, Object.assign(Object.assign({}, getConfig()), eventData), options, sendWithBeacon);
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
exports.default = Plausible;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdHJhY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFvRDtBQXFMcEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9DRztBQUVILFNBQXdCLFNBQVMsQ0FDL0IsUUFBK0I7SUFPL0IsTUFBTSxZQUFZLEdBQUcsR0FBRyxFQUFFO1FBQ3hCLHFEQUFxRDtRQUNyRCxNQUFNLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRyxHQUErQixFQUFFLENBQUMsaUJBQ2xELFFBQVEsRUFBRSxLQUFLLEVBQ2YsY0FBYyxFQUFFLEtBQUssRUFDckIsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQ2xCLE1BQU0sRUFBRSxRQUFRLENBQUMsUUFBUSxFQUN6QixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQ25DLFdBQVcsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUM5QixPQUFPLEVBQUUsc0JBQXNCLElBQzVCLFFBQVEsRUFDWCxDQUFDO0lBRUgsTUFBTSxVQUFVLEdBQWUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxjQUFjLEdBQUcsS0FBSyxFQUFFLEVBQUU7UUFDdkYsbUJBQVMsQ0FBQyxTQUFTLGtDQUFPLFNBQVMsRUFBRSxHQUFLLFNBQVMsR0FBSSxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDbEYsQ0FBQyxDQUFDO0lBRUYsWUFBWSxFQUFFLENBQUM7SUFFZixNQUFNLGFBQWEsR0FBa0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDMUQsVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDO0lBRUYsTUFBTSxtQkFBbUIsR0FBd0IsR0FBRyxFQUFF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