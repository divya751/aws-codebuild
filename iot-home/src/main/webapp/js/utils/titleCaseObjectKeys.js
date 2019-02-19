import sentenceCase from 'sentence-case'
import capitalize from 'string-capitalize'

export default function titleCaseObjectKeys(obj, customMappings = {}, defaultPrefix = "") {
    const result = {}
    for (const field of Object.keys(obj)) {
        if (("props") == field && obj["props"]) {
            for (const prop of Object.keys(obj["props"])) {
                if (prop.indexOf("childAction") >= 0) {
                    continue
                }
                let readablePropName = customMappings[prop] ? customMappings[prop] : ("Prop: " + capitalize(sentenceCase(prop)))
                readablePropName = readablePropName.replace(/ id$/, " ID")
                result[readablePropName] = obj["props"][prop]
            }
        }
        else {
            let newKey = customMappings[field] ? customMappings[field] : (capitalize(defaultPrefix + sentenceCase(field)))
            newKey = newKey.replace(/ id$/, " ID")
            newKey = newKey.replace(/^id$/, "ID")
            result[newKey] = obj[field]
        }
    }
    return result
}