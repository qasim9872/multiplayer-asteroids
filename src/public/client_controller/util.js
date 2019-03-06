/**
 * diff between keyboard states
 * @param  {Object} lastState Object compared
 * @param  {Object} currentState   Object to compare with
 * @return {Object} Return a new object who represent the diff
 */
function difference(lastState, currentState) {

    if (!lastState) return currentState;

    const diffResult = Object.keys(currentState).reduce((diff, key) => {

        const currentStateValue = currentState[key];
        const lastStateValue = lastState[key];


        if (currentStateValue !== lastStateValue) {
            diff[key] = currentStateValue;
        }

        return diff;

    }, {});

    return Object.keys(diffResult).length > 0 ? diffResult : null;
}