import { PrismaClient } from '@prisma/client';
import LodgingClient from './LodgingClient'; 
const prisma = new PrismaClient();

async function getLodging(id) {
  const lodging = await prisma.lodging.findUnique({
    where: { id: parseInt(id) },
    include: { rooms: true },
  });
  return lodging;
}

export default async function LodgingDetailsPage(props) {
  const params = await props.params; 
  const lodging = await getLodging(params.id);

  if (!lodging) {
    return <div style={{padding: '40px', textAlign: 'center'}}>Lodging not found.</div>;
  }
  return <LodgingClient lodging={lodging} />;
}