import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Créé au premier appel : l'import de ce module peut précéder Amplify.configure
let dataClient: ReturnType<typeof generateClient<Schema>> | undefined;
export const client = () => (dataClient ??= generateClient<Schema>());
