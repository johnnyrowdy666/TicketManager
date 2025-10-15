// หน่วยความจำสำหรับการพรีวิวเมื่อยังไม่เชื่อม MongoDB
module.exports = {
  users: [],
  events: [
    {
      _id: 'evt1',
      title: 'Sample Music Festival',
      description: 'เทศกาลดนตรีตัวอย่างเพื่อทดสอบระบบ',
      imageUrl: '/placeholder.svg',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      location: 'Bangkok',
      capacity: 100,
      price: 500,
      ownerId: null,
    },
    {
      _id: 'evt2',
      title: 'Tech Meetup',
      description: 'งานพบปะคนไอที',
      imageUrl: '/placeholder.svg',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      location: 'Chiang Mai',
      capacity: 50,
      price: 0,
      ownerId: null,
    },
  ],
  orders: [],
};