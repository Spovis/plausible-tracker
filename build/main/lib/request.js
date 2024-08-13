"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEvent = void 0;
/**
 * @internal
 * Sends an event to Plausible's API
 *
 * @param data - Event data to send
 * @param options - Event options
 */
function sendEvent(eventName, data, options, sendWithBeacon = false) {
    const isLocalhost = /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*:)*?:?0*1$/.test(location.hostname) || location.protocol === 'file:';
    if (!data.trackLocalhost && isLocalhost) {
        return console.warn('[Plausible] Ignoring event because website is running locally');
    }
    try {
        if (window.localStorage.plausible_ignore === 'true') {
            return console.warn('[Plausible] Ignoring event because "plausible_ignore" is set to "true" in localStorage');
        }
    }
    catch (e) {
        null;
    }
    const payload = {
        n: eventName,
        u: data.url,
        d: data.domain,
        r: data.referrer,
        w: data.deviceWidth,
        h: data.hashMode ? 1 : 0,
        p: options && options.props ? JSON.stringify(options.props) : undefined,
    };
    if (sendWithBeacon) {
        navigator.sendBeacon(`${data.apiHost}/api/event`, JSON.stringify(payload));
    }
    else {
        const req = new XMLHttpRequest();
        req.open('POST', `${data.apiHost}/api/event`, true);
        req.setRequestHeader('Content-Type', 'text/plain');
        req.send(JSON.stringify(payload));
        // eslint-disable-next-line functional/immutable-data
        req.onreadystatechange = () => {
            if (req.readyState !== 4)
                return;
            if (options && options.callback) {
                options.callback({ status: req.status });
            }
        };
    }
}
exports.sendEvent = sendEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUErQkE7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsU0FBUyxDQUN2QixTQUFpQixFQUNqQixJQUFnQyxFQUNoQyxPQUFzQixFQUN0QixpQkFBMEIsS0FBSztJQUUvQixNQUFNLFdBQVcsR0FDZiw2REFBNkQsQ0FBQyxJQUFJLENBQ2hFLFFBQVEsQ0FBQyxRQUFRLENBQ2xCLElBQUksUUFBUSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7SUFFckMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksV0FBVyxFQUFFO1FBQ3ZDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FDakIsK0RBQStELENBQ2hFLENBQUM7S0FDSDtJQUVELElBQUk7UUFDRixJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEtBQUssTUFBTSxFQUFFO1lBQ25ELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FDakIsd0ZBQXdGLENBQ3pGLENBQUM7U0FDSDtLQUNGO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixJQUFJLENBQUM7S0FDTjtJQUVELE1BQU0sT0FBTyxHQUFpQjtRQUM1QixDQUFDLEVBQUUsU0FBUztRQUNaLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRztRQUNYLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTTtRQUNkLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUTtRQUNoQixDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVc7UUFDbkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixDQUFDLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQ3hFLENBQUM7SUFFRixJQUFJLGNBQWMsRUFBRTtRQUNsQixTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUM1RTtTQUFNO1FBQ0wsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRCxHQUFHLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLHFEQUFxRDtRQUNyRCxHQUFHLENBQUMsa0JBQWtCLEdBQUcsR0FBRyxFQUFFO1lBQzVCLElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyxDQUFDO2dCQUFFLE9BQU87WUFDakMsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDL0IsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUMxQztRQUNILENBQUMsQ0FBQztLQUNIO0FBQ0gsQ0FBQztBQXBERCw4QkFvREMifQ==