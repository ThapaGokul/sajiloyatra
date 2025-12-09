'use client'; 
import { seasonsData } from '../../../data/data';

export default function SeasonDetailPage({ params }) {
 
  const { slug } = params;

 
  const season = seasonsData.find(s => s.slug === slug);

  if (!season) {
    return (
      <div style={{ paddingTop: '120px', padding: '40px' }}>
        <h1>Season not found!</h1>
      </div>
    );
  }


  return (
    <div style={{ paddingTop: '120px', padding: '40px' }}>
      <h1>{season.season} in Nepal</h1>
      <p>{season.description}</p>
    </div>
  );
}