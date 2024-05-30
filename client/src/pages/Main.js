import React from 'react';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Healthcare Systems</h1>
      <p>
        In today's world, healthcare systems play a crucial role in providing medical services
        to individuals. These systems encompass a wide range of institutions, professionals,
        and technologies aimed at improving the quality of healthcare delivery.
      </p>
      <p>
        Whether you are a doctor looking to connect with patients or an individual seeking
        medical assistance, our platform provides the tools and resources to streamline
        your healthcare experience.
      </p>
      <div>
        <button style={{ fontSize: '1.5em', marginRight: '1em' }}>Sign Up as a Doctor</button>
        <button style={{ fontSize: '1.5em' }}>Sign Up as a User</button>
      </div>
      <button style={{ position: 'absolute', top: '10px', right: '10px' }}>Login</button>
    </div>
  );
};

export default HomePage;
