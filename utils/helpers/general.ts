import _ from "lodash";

export const camelize = (obj: Record<string, any>) =>
  _.transform(obj, (acc: any, value, key, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);

    // Handle Date objects - convert to ISO string before camelizing
    if (value instanceof Date) {
      acc[camelKey] = value.toISOString();
    } else if (_.isObject(value) && !_.isArray(value)) {
      // Only recursively camelize if it's a plain object (not Date, not Array)
      acc[camelKey] = camelize(value);
    } else {
      acc[camelKey] = value;
    }
  });
