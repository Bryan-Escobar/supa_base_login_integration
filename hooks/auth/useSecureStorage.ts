import * as SecureStore from 'expo-secure-store';

// Guardar un valor
async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

// Leer un valor
async function getValueFor(key: string): Promise<string | null> {
    const result = await SecureStore.getItemAsync(key);
    if (result) {
        return result;
    }
    return null;
}

// Borrar un valor
async function deleteValue(key: string) {
    await SecureStore.deleteItemAsync(key);
}
export { deleteValue, getValueFor, save };

