import { ObjectId } from 'mongodb';

import { getUser } from 'src/auth/lib/mongodb/get-user';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

    const userSettings = await getUser();

    if (!userSettings.hosts || userSettings.hosts.length === 0) {
      return Response.json({ error: 'No hosts found for the user. Please ensure the user has the necessary hosts configured.' }, { status: 404 });
    }

    const {assignedCount} = userSettings.seeds;

    let hosts = await Promise.all(
      userSettings.hosts.map(async (hostId: ObjectId) =>
        db.collection('hosts').findOne({ _id: new ObjectId(hostId) })
      )
    );

    // Filter out null values
    hosts = hosts.filter((host) => host !== null);

    // Transform hosts array
    hosts = hosts.map((host) => ({ _id: host._id, host: host.host }));

    return Response.json({ hosts, assignedCount });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
