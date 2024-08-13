/**
 * @internal
 * Sends an event to Plausible's API
 *
 * @param data - Event data to send
 * @param options - Event options
 */
export function sendEvent(eventName, data, options, sendWithBeacon = false) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUErQkE7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FDdkIsU0FBaUIsRUFDakIsSUFBZ0MsRUFDaEMsT0FBc0IsRUFDdEIsaUJBQTBCLEtBQUs7SUFFL0IsTUFBTSxXQUFXLEdBQ2YsNkRBQTZELENBQUMsSUFBSSxDQUNoRSxRQUFRLENBQUMsUUFBUSxDQUNsQixJQUFJLFFBQVEsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDO0lBRXJDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLFdBQVcsRUFBRTtRQUN2QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQ2pCLCtEQUErRCxDQUNoRSxDQUFDO0tBQ0g7SUFFRCxJQUFJO1FBQ0YsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLGdCQUFnQixLQUFLLE1BQU0sRUFBRTtZQUNuRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQ2pCLHdGQUF3RixDQUN6RixDQUFDO1NBQ0g7S0FDRjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsSUFBSSxDQUFDO0tBQ047SUFFRCxNQUFNLE9BQU8sR0FBaUI7UUFDNUIsQ0FBQyxFQUFFLFNBQVM7UUFDWixDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUc7UUFDWCxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU07UUFDZCxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVE7UUFDaEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXO1FBQ25CLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztLQUN4RSxDQUFDO0lBRUYsSUFBSSxjQUFjLEVBQUU7UUFDbEIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDNUU7U0FBTTtRQUNMLE1BQU0sR0FBRyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEQsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNuRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNsQyxxREFBcUQ7UUFDckQsR0FBRyxDQUFDLGtCQUFrQixHQUFHLEdBQUcsRUFBRTtZQUM1QixJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssQ0FBQztnQkFBRSxPQUFPO1lBQ2pDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQy9CLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDMUM7UUFDSCxDQUFDLENBQUM7S0FDSDtBQUNILENBQUMifQ==