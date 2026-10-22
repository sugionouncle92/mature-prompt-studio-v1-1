import type { StoryCategory, MatureSubstyle, MatureSensualIntensity } from '../types/index.ts';

export const MATURE_SOLO_SUBSTYLES: string[] = [
  'Soft Sensuality',
  'Feminine & Delicate',
  'Confident & Alluring',
  'Casual Sensual Lifestyle',
  'Intimate & Cozy',
  'Subtle Teasing',
  'Bold Sensual Posing',
  'Provocative Reclining',
  'Sultry Over-the-Shoulder',
  'Dominant & Commanding Pose',
  'Intense Erotic Expression',
  'Boudoir Elegance',
  'Adult Glamour Magazine',
  'Luxury Lingerie Editorial',
  'Provocative Pin-Up Glamour',
  'Glamour & Seduction',
  'Artistic Erotic Fine Art',
  'Implied Nude Fine Art',
  'Classic Erotic Glamour',
];

export const MATURE_COUPLE_STYLES: string[] = [
  'Unfiltered Adult Sensuality',
  'Intense Adult Intimacy',
  'Intimate Bedroom Atmosphere',
  'Sensual Couple Boudoir',
  'Passionate Romantic Encounter',
  'Seductive Couple Interaction',
  'Dominant–Submissive Aesthetic',
  'Forbidden Adult Attraction',
  'Passionate Kissing',
  'Physical Romantic Chemistry',
  'Seductive Atmosphere',
  'Intimate Romantic Tension',
  'Bold Romantic Chemistry',
  'Alluring Character Interaction',
  'Sensual & Alluring',
  'Confident Adult Flirtation',
  'Subtle Suggestiveness',
  'Mysterious Attraction',
  'Mature Romantic Drama',
  'Mature Relationship Tension',
  'Elegant Sensuality',
  'Afterglow Couple Portrait',
];

export const STORY_CATEGORIES: StoryCategory[] = [
  {
    id: 'humor-comedy',
    name: 'Humor & Comedy',
    iconName: 'Laugh',
    items: [
      'Situational Comedy',
      'Playful Humor',
      'Slapstick Comedy',
      'Awkward Moments',
      'Sarcastic Humor',
      'Witty Banter',
      'Prank & Mischief',
      'Funny Misunderstanding',
      'Unexpected Reactions',
      'Lighthearted Comedy',
    ],
  },
  {
    id: 'cinematic-film',
    name: 'Cinematic & Film',
    iconName: 'Film',
    items: [
      'Cinematic Drama',
      'Hollywood Movie Scene',
      'Indie Film Aesthetic',
      'Neo-Noir Cinema',
      'Epic Cinematic',
      'Suspenseful Cinematic',
      'One-Take Scene',
      'Movie Poster Composition',
      'Film Still Aesthetic',
      'Documentary Cinematic',
    ],
  },
  {
    id: 'romance-relationships',
    name: 'Romance & Relationships',
    iconName: 'Heart',
    items: [
      'Mature Romance',
      'Romantic Comedy',
      'Slow-Burn Romance',
      'Playful Flirtation',
      'Romantic Tension',
      'Emotional Intimacy',
      'Forbidden-Love Atmosphere',
      'Relationship Drama',
      'Tender Romantic Moment',
      'Passionate Romance',
    ],
  },
  {
    id: 'mature-sensual',
    name: 'Mature & Sensual',
    iconName: 'Flame',
    items: [
      ...MATURE_SOLO_SUBSTYLES,
      ...MATURE_COUPLE_STYLES,
    ],
  },
  {
    id: 'drama-emotion',
    name: 'Drama & Emotion',
    iconName: 'Theater',
    items: [
      'Emotional Drama',
      'Family Drama',
      'Personal Conflict',
      'Heartfelt Reunion',
      'Emotional Revelation',
      'Betrayal & Suspicion',
      'Difficult Decision',
      'Tearjerker Moment',
      'Hope & Redemption',
      'Bittersweet Ending',
    ],
  },
  {
    id: 'thriller-suspense',
    name: 'Thriller & Suspense',
    iconName: 'Eye',
    items: [
      'Psychological Thriller',
      'Mystery & Intrigue',
      'Crime Drama',
      'Suspenseful Encounter',
      'Hidden Secret',
      'Unexpected Visitor',
      'Cat-and-Mouse Tension',
      'Investigation Scene',
      'Paranormal Suspense',
      'Plot Twist Moment',
    ],
  },
  {
    id: 'action-adventure',
    name: 'Action & Adventure',
    iconName: 'Zap',
    items: [
      'Action Movie Scene',
      'Adventure Drama',
      'Chase Sequence',
      'Survival Situation',
      'Heroic Moment',
      'High-Stakes Confrontation',
      'Spy Thriller',
      'Rescue Mission',
      'Martial Arts Cinematic',
      'Epic Showdown',
    ],
  },
  {
    id: 'slice-of-life',
    name: 'Slice of Life',
    iconName: 'Coffee',
    items: [
      'Everyday Realism',
      'Domestic Life',
      'Workplace Interaction',
      'Casual Conversation',
      'Unexpected Daily Encounter',
      'Neighborhood Story',
      'Travel Moment',
      'Family Gathering',
      'Behind-the-Scenes Moment',
      'Authentic Candid Photography',
    ],
  },
  {
    id: 'fantasy-supernatural',
    name: 'Fantasy & Supernatural',
    iconName: 'Sparkles',
    items: [
      'Dark Fantasy',
      'Magical Realism',
      'Mythological Drama',
      'Supernatural Mystery',
      'Gothic Atmosphere',
      'Dreamlike Narrative',
      'Enchanted Encounter',
      'Fantasy Adventure',
      'Paranormal Romance',
      'Surreal Visual Storytelling',
    ],
  },
  {
    id: 'period-cultural',
    name: 'Period & Cultural Drama',
    iconName: 'Landmark',
    items: [
      'Historical Drama',
      'Traditional Indonesian Story',
      'Javanese Cultural Atmosphere',
      'Vintage Romance',
      'Period Film Aesthetic',
      'Royal Court Intrigue',
      'Traditional Village Life',
      'Nostalgic Memories',
      'Retro Comedy',
      'Heritage Cinematic Drama',
    ],
  },
  {
    id: 'social-human',
    name: 'Social & Human Interaction',
    iconName: 'Users',
    items: [
      'Awkward First Meeting',
      'Friendly Rivalry',
      'Unexpected Kindness',
      'Secret Admiration',
      'Miscommunication',
      'Power Dynamics in Conversation',
      'Negotiation & Persuasion',
      'Public Embarrassment',
      'Emotional Confrontation',
      'Unexpected Friendship',
    ],
  },
  {
    id: 'commercial-editorial',
    name: 'Commercial & Editorial Storytelling',
    iconName: 'Briefcase',
    items: [
      'Commercial Lifestyle',
      'Luxury Editorial',
      'Fashion Campaign',
      'Beauty Editorial',
      'Lifestyle Advertising',
      'Professional Portrait Story',
      'Brand Campaign Aesthetic',
      'Magazine Editorial',
      'Documentary Lifestyle',
      'Authentic Human Moments',
    ],
  },
  {
    id: 'professional-photography',
    name: 'Professional & Studio Photography',
    iconName: 'Camera',
    items: [
      'Professional Studio Portrait',
      'Corporate & Executive Portrait',
      'Personal Branding Portrait',
      'Beauty & Glamour Portrait',
      'Fashion Editorial Studio',
      'Fine Art Portrait',
      'Dramatic Studio Portrait',
      'Passport & ID Portrait',
      'Graduation Portrait',
      'Maternity Portrait',
      'Newborn & Baby Portrait',
      'Family & Group Portrait',
      'Prewedding & Couple Portrait',
      'Couple & Anniversary Portrait',
      'Commercial Product Photography',
      'E-commerce Catalog Photography',
      'High-Key Studio Photography',
      'Low-Key Studio Photography',
    ],
  },
];

export const STORY_STYLE_DESCRIPTIONS: Record<string, string> = {
  // Humor & Comedy
  'Situational Comedy':
    'Komedi yang muncul dari situasi sehari-hari, kesalahpahaman, atau kondisi tak terduga. Cocok untuk adegan lucu yang terasa alami dan dekat dengan kehidupan nyata.',
  'Playful Humor':
    'Humor ringan, ceria, dan penuh kelakar yang santai. Menghidupkan interaksi hangat dan bersahabat tanpa ketegangan konflik emosional berat.',
  'Slapstick Comedy':
    'Komedi fisik yang mengandalkan dinamika gerak spontan, kecanggungan gerak-gerik, dan ekspresi visual yang ekspresif. Sangat pas untuk adegan kekacauan konyol yang mengundang tawa.',
  'Awkward Moments':
    'Humor yang berakar dari kecanggungan sosial, momen jeda yang canggung, atau rasa salah tingkah antar karakter. Memberikan nuansa komedi relasional yang realistis dan menggelitik.',
  'Sarcastic Humor':
    'Humor bernada sindiran tajam, celetukan sinis, atau ironi cerdas yang memikat. Cocok untuk karakter berwatak tegas atau adegan perdebatan intelektual yang santai.',
  'Witty Banter':
    'Adu dialog cepat, cerdas, dan penuh balasan jenaka yang dinamis antara dua karakter. Menonjolkan chemistry verbal yang kuat dan memikat dalam interaksi kasual maupun profesional.',
  'Prank & Mischief':
    'Cerita yang berpusat pada keisengan jenaka, tipuan mengejutkan, dan reaksi kaget yang lucu. Menciptakan dinamika bermain yang riang dan tak terduga di antara karakter.',
  'Funny Misunderstanding':
    'Komedi yang dipicu oleh pesan atau maksud yang salah dipahami sehingga melahirkan situasi menggelikan yang kian rumit. Sangat tepat untuk adegan salah duga yang berujung tawa.',
  'Unexpected Reactions':
    'Humor yang menyoroti kontras antara peristiwa yang terjadi dengan respons spontan karakter yang tidak lazim atau di luar dugaan. Menciptakan efek kejutan komedi yang menyegarkan.',
  'Lighthearted Comedy':
    'Komedi santai dengan suasana hangat dan menyenangkan, tanpa tekanan konflik yang berat. Ideal untuk adegan yang ingin menyajikan hiburan menyenangkan penuh senyuman.',

  // Cinematic & Film
  'Cinematic Drama':
    'Drama berbobot film layar lebar dengan sorotan emosi mendalam, komposisi framing terencana, dan ketegangan watak yang intens. Sangat kuat untuk momen puncak konfrontasi personal.',
  'Hollywood Movie Scene':
    'Gaya adegan film komersial dengan penceritaan dramatis, blocking presisi, pencahayaan megah, dan penyajian sinematik yang mudah dikenali.',
  'Indie Film Aesthetic':
    'Gaya film independen yang lebih personal, intim, artistik, dan berfokus pada kejujuran karakter serta detail kehidupan sehari-hari.',
  'Neo-Noir Cinema':
    'Gaya sinema gelap dengan atmosfer misterius, bayangan kontras tajam (chiaroscuro), moralitas ambigu, dan ketegangan psikologis yang pekat.',
  'Epic Cinematic':
    'Gaya cerita berskala besar dengan kesan megah, monumental, dan taruhan emosi yang tinggi. Cocok untuk adegan berenergi besar dan panorama menakjubkan.',
  'Suspenseful Cinematic':
    'Gaya sinematik yang membangun antisipasi, ketidakpastian, dan ketegangan secara bertahap melalui sudut pandang mendebarkan dan jeda visual yang cermat.',
  'One-Take Scene':
    'Penceritaan yang menyimulasikan kesinambungan adegan tanpa jeda potong, mengikuti pergerakan karakter secara dinamis dan imersif seolah berada di lokasi.',
  'Movie Poster Composition':
    'Tata letak visual yang tertata berani dan artistik layaknya poster promosi film bioskop. Menonjolkan hierarki visual tegas dan daya tarik magnetis karakter.',
  'Film Still Aesthetic':
    'Tangkapan adegan yang tampak seperti potongan film bioskop asli dengan palet warna terkurasi dan emosi beku yang mendalam dalam satu bingkai.',
  'Documentary Cinematic':
    'Pendekatan visual realistis dan otentik layaknya film dokumenter berkualitas tinggi. Menangkap momen tanpa rekayasa berlebih dengan kejujuran ekspresi nyata.',

  // Romance & Relationships
  'Mature Romance':
    'Kisah asmara dewasa yang matang, penuh pemahaman emosional, kelembutan, dan komitmen mendalam. Menggambarkan kedewasaan hubungan yang hangat dan bermakna.',
  'Romantic Comedy':
    'Perpaduan manis antara percintaan yang menggetarkan hati dan momen-momen lucu yang menghibur. Sangat cocok untuk kencan ceria dan dinamika kasual yang manis.',
  'Slow-Burn Romance':
    'Asmara yang berkembang perlahan melalui tatapan bertahap, kebersamaan hening, dan kedekatan yang terjalin langkah demi langkah dengan ikatan batin kuat.',
  'Playful Flirtation':
    'Interaksi menggoda yang ceria, penuh senyuman jahil, tatapan menggoda, dan candaan manis antar pasangan. Menghidupkan percikan awal ketertarikan secara menyenangkan.',
  'Romantic Tension':
    'Ketegangan romantis yang membuncah lewat jarak fisik yang dekat, kata-kata yang tertahan, dan getaran emosi tak terucapkan yang mendebarkan.',
  'Emotional Intimacy':
    'Menekankan kedekatan batin, percakapan dari hati ke hati, rasa saling percaya, dan keterbukaan tanpa rahasia dalam suasana yang tenang dan hangat.',
  'Forbidden-Love Atmosphere':
    'Nuansa cinta rahasia yang terhalang rintangan sosial, situasi rumit, atau batasan norma. Dipenuhi tatapan tersembunyi, kerinduan mendalam, dan bahaya yang manis.',
  'Relationship Drama':
    'Gesekan emosional, perdebatan tentang masa depan, atau benturan prinsip yang menguji ketahanan suatu hubungan. Membawa dinamika perasaan yang kompleks dan realistis.',
  'Tender Romantic Moment':
    'Momen romantis yang lembut seperti rangkulan pelindung, bisikan hangat, atau kecupan penuh ketulusan. Menampilkan sisi paling rentan dan penuh kasih sayang.',
  'Passionate Romance':
    'Percintaan penuh gairah membara, tarikan magnetis yang tak terbendung, dan intensitas emosional yang kuat antara dua insan yang saling terpikat.',

  // Mature & Sensual Substyles (19 Detailed Substyles)
  'Soft Sensuality':
    'Sensualitas lembut yang alami, memancarkan keanggunan bersahaja, gestur santai, dan pesona feminin yang menenangkan tanpa pose berlebihan.',
  'Feminine & Delicate':
    'Estetika feminin yang anggun dan rapuh secara artistik, menonjolkan kehalusan detail, lekuk siluet gemulai, dan keanggunan gerak yang puitis.',
  'Confident & Alluring':
    'Daya pikat wanita dewasa yang penuh percaya diri, tatapan magnetis yang memikat langsung ke kamera, dan postur anggun yang memesona.',
  'Casual Sensual Lifestyle':
    'Potret gaya hidup kasual yang intim dan autentik di ruang privat, menangkap momen santai harian dengan daya pikat alami tanpa rekayasa.',
  'Intimate & Cozy':
    'Suasana hangat, nyaman, dan intim di lingkungan kamar tidur atau ruang santai, berpadu dengan tekstur selimut lembut dan pencahayaan temaram.',
  'Subtle Teasing':
    'Nuansa menggoda yang halus dan menyenangkan melalui bahasa tubuh yang ceria, tatapan nakal, dan gesture kecil yang memancing rasa penasaran.',
  'Bold Sensual Posing':
    'Pose sensual yang tegas dan percaya diri tinggi, menonjolkan lekuk tubuh secara dinamis dengan sudut pengambilan gambar yang artistik dan berani.',
  'Provocative Reclining':
    'Pose berbaring yang provokatif dan menggoda di atas tempat tidur atau chaise lounge, dengan garis tubuh memanjang dan komposisi visual yang memikat.',
  'Sultry Over-the-Shoulder':
    'Tatapan sensual dari balik bahu yang menonjolkan lekuk punggung yang anggun, garis leher memanjang, dan siluet yang memikat.',
  'Dominant & Commanding Pose':
    'Bahasa tubuh dominan, anggun, dan berwibawa tinggi, menampilkan sosok wanita dewasa yang menguasai ruangan dengan aura kekuasaan yang sensual.',
  'Intense Erotic Expression':
    'Fokus pada kedalaman ekspresi emosional yang intens dan sensual, menangkap napas yang tertahan, tatapan menghanyutkan, dan gairah visual yang pekat.',
  'Boudoir Elegance':
    'Fotografi boudoir klasik yang mewah dan berkelas, memadukan keindahan ruang tidur privat, dekorasi elegan, dan pesona wanita dewasa yang agung.',
  'Adult Glamour Magazine':
    'Gaya pemotretan majalah glamor dewasa ala editorial 90-an dan modern, dengan pencahayaan terang merata, pose terarah, dan visual memukau.',
  'Luxury Lingerie Editorial':
    'Fotografi editorial pakaian dalam dan gaun tidur mewah, menonjolkan presisi tekstur sutra, renda Prancis, dan lekuk siluet yang adiluhung.',
  'Provocative Pin-Up Glamour':
    'Sentuhan retro glamor klasik pin-up era emas dengan pose menggoda yang ceria, siluet jam pasir yang tegas, dan estetika vintage berkarakter.',
  'Glamour & Seduction':
    'Perpaduan kemewahan busana malam dan daya tarik godaan yang memikat, menghadirkan pesona femme fatale yang anggun dan berbahaya.',
  'Artistic Erotic Fine Art':
    'Fotografi seni rupa erotis bernilai estetika museum, memadukan bentuk tubuh manusia sebagai patung hidup melalui permainan bayangan dan cahaya dramatis.',
  'Implied Nude Fine Art':
    'Seni rupa tersirat (implied) yang mengandalkan siluet, bayangan arsitektural, tirai tipis, atau properti untuk menyamarkan tubuh secara puitis dan bermartabat.',
  'Classic Erotic Glamour':
    'Gaya glamor erotis klasik era sinema Eropa 1970-1980-an, menghadirkan estetika seluloid film 35mm, butiran film halus, dan nostalgia sensual yang abadi.',

  // Mature & Sensual - Legacy Styles (Preserved for compatibility)
  'Sensual & Alluring':
    'Daya pikat sensual berkelas yang memancarkan pesona magnetis, keanggunan gerak, dan kontak mata memikat. Mengedepankan estetika dewasa yang memukau tanpa terkesan vulgar.',
  'Confident Adult Flirtation':
    'Sikap menggoda dari karakter dewasa yang percaya diri, tahu apa yang diinginkannya, dan berani mengekspresikan ketertarikan secara berkarisma.',
  'Seductive Atmosphere':
    'Atmosfer ruangan yang intim dengan pencahayaan temaram, nuansa hangat, dan aura misterius yang memikat. Membangun suasana romantis yang pekat dan mendebarkan.',
  'Intimate Romantic Tension':
    'Ketegangan romantis dalam jarak fisik yang sangat dekat, helaan napas teratur, dan antisipasi sentuhan sebelum momen puncak kedekatan.',
  'Elegant Sensuality':
    'Menampilkan sensualitas berpadu kemewahan busana, lekuk siluet yang anggun, dan postur penuh martabat. Memprioritaskan keindahan visual artistik dan nuansa mewah.',
  'Bold Romantic Chemistry':
    'Percikan ketertarikan yang tegas dan saling bersambut di antara dua individu dewasa. Menampilkan keberanian emosi dan rasa saling mengagumi yang nyata.',
  'Mysterious Attraction':
    'Daya tarik memikat yang diselimuti misteri dan tatapan penuh rahasia yang sulit ditebak. Membuat karakter tampak menarik dan memancing rasa penasaran yang dalam.',
  'Mature Romantic Drama':
    'Konflik asmara dewasa yang menyangkut gairah, kesetiaan, dan pilihan hidup yang kompleks. Menghadirkan emosi berlapis dengan nuansa elegan.',
  'Subtle Suggestiveness':
    'Daya pikat halus lewat isyarat kecil seperti senyuman tipis, permainan tatapan mata, atau jemari yang bersentuhan lembut. Menghadirkan imajinasi sensual yang cermat.',
  'Alluring Character Interaction':
    'Dinamika tatap muka yang intens antar karakter dewasa dengan bahasa tubuh yang saling melengkapi dan mempesona. Sangat pas untuk adegan percakapan intim berdua.',
  'Intense Adult Intimacy':
    'Visual kedekatan intim pasangan dewasa melalui kontak mata, jarak fisik, gestur romantis, sentuhan yang wajar, dan ekspresi emosional yang intens.',
  'Passionate Romantic Encounter':
    'Visual interaksi romantis penuh gairah antara pasangan dewasa, dengan pose natural, chemistry yang kuat, ekspresi realistis, serta pencahayaan sinematik.',
  'Seductive Couple Interaction':
    'Interaksi pasangan dewasa yang menggoda melalui tatapan, senyuman, postur, gestur, dan bahasa tubuh yang menunjukkan ketertarikan timbal balik.',
  'Intimate Bedroom Atmosphere':
    'Visual pasangan dewasa dalam suasana kamar privat dengan pencahayaan lembut atau redup, tekstur kain yang detail, komposisi intim, dan atmosfer sinematik.',
  'Passionate Kissing':
    'Adegan ciuman romantis penuh gairah antara pasangan dewasa dengan posisi kepala dan tubuh yang anatomis, ekspresi natural, serta kontak fisik yang meyakinkan.',
  'Physical Romantic Chemistry':
    'Menonjolkan ketertarikan fisik antarpasangan dewasa melalui postur, orientasi tubuh, kontak mata, jarak interpersonal, dan gestur yang natural.',
  'Afterglow Couple Portrait':
    'Potret pasangan dewasa setelah momen romantis dengan ekspresi tenang, kedekatan emosional, gestur lembut, dan pencahayaan yang hangat.',
  'Forbidden Adult Attraction':
    'Visual hubungan romantis yang rumit atau kontroversial melalui ekspresi ambigu, tatapan tersembunyi, konflik emosional, dan atmosfer dramatis.',
  'Dominant–Submissive Aesthetic':
    'Dinamika visual pasangan dewasa dengan perbedaan sikap dominan dan pasif yang disepakati, disampaikan melalui pose, gestur, ekspresi, dan bahasa tubuh.',
  'Mature Relationship Tension':
    'Ketegangan hubungan pasangan dewasa yang diperlihatkan melalui kedekatan yang tertahan, ekspresi emosional, kontak mata, dan komposisi dramatis.',
  'Sensual Couple Boudoir':
    'Fotografi artistik pasangan dewasa dalam suasana privat dengan styling elegan, pose intim, detail material pakaian, dan pencahayaan editorial.',
  'Unfiltered Adult Sensuality':
    'Gaya visual sensual dewasa yang menggunakan deskripsi pose, outfit, ekspresi, dan interaksi secara spesifik serta lugas tanpa penghalusan bahasa yang tidak diperlukan.',

  // Drama & Emotion
  'Emotional Drama':
    'Penggalian perasaan mendalam yang mengeksplorasi kerapuhan hati, konflik batin, dan perjalanan emosi karakter. Cocok untuk adegan yang menyentuh empati terdalam.',
  'Family Drama':
    'Dinamika relasi keluarga yang sarat akan sejarah masa lalu, tanggung jawab moral, dan harapan yang bersinggungan. Menyoroti ikatan darah dengan segala kehangatan dan tantangannya.',
  'Personal Conflict':
    'Pergulatan batin karakter dalam menghadapi keraguan diri, pilihan moral sulit, atau penyesalan lama. Mengutamakan ekspresi tatapan emosional yang berat.',
  'Heartfelt Reunion':
    'Momen pertemuan kembali yang mengharukan setelah perpisahan panjang atau kesalahpahaman masa lalu. Dipenuhi luapan kelegaan, air mata bahagia, dan pelukan erat.',
  'Emotional Revelation':
    'Pengungkapan rahasia besar atau kebenaran tak terduga yang mengubah drastis jalan hidup karakter. Menghadirkan ekspresi terkejut, syok, atau kebebasan batin.',
  'Betrayal & Suspicion':
    'Atmosfer kecurigaan, rasa kecewa mendalam atas pengkhianatan orang terdekat, dan hancurnya rasa percaya. Menampilkan ketegangan dingin dan tatapan penuh luka.',
  'Difficult Decision':
    'Saat karakter berdiri di persimpangan jalan krusial dengan konsekuensi yang berat bagi masa depannya. Menekankan ketegangan psikologis dan beban tanggung jawab.',
  'Tearjerker Moment':
    'Adegan yang menguras air mata dengan duka mendalam, perpisahan menyakitkan, atau pengorbanan tulus. Membangun keharuan emosional yang menyentuh sanubari.',
  'Hope & Redemption':
    'Perjalanan karakter bangkit dari keterpurukan, memperbaiki kesalahan masa lalu, dan menemukan secercah harapan baru. Membawa pesan optimisme dan kehangatan jiwa.',
  'Bittersweet Ending':
    'Penutup kisah yang memadukan kelegaan dengan rasa kehilangan yang syahdu. Meninggalkan kesan mendalam tentang penerimaan hidup dan kedewasaan emosi.',

  // Thriller & Suspense
  'Psychological Thriller':
    'Ketegangan pikiran yang menguji kewarasan, manipulasi mental, dan persepsi realitas yang meragukan. Cocok untuk adegan penuh kecemasan dan misteri psikologis.',
  'Mystery & Intrigue':
    'Penyelidikan teka-teki yang penuh petunjuk samar, motif tersembunyi, dan rasa penasaran yang memuncak. Sangat pas untuk adegan pembongkaran misteri rahasia.',
  'Crime Drama':
    'Kisah berlatar dunia kriminal, pelanggaran hukum, atau pertarungan moral antara keadilan dan kegelapan kota. Menghadirkan atmosfer dingin, terencana, dan berbahaya.',
  'Suspenseful Encounter':
    'Pertemuan tak terduga yang sarat bahaya di mana setiap kata dan gerakan diawasi dengan cermat. Menciptakan ketegangan tinggi yang membuat detak jantung berpacu.',
  'Hidden Secret':
    'Menyoroti karakter yang menyimpan rahasia besar sambil berusaha menjaga ketenangannya di hadapan orang lain. Menonjolkan rasa cemas dan kewaspadaan tinggi.',
  'Unexpected Visitor':
    'Ketegangan yang muncul saat ketukan pintu atau kehadiran tamu asing merusak ketenangan malam. Menimbulkan tanda tanya besar tentang identitas dan niat sang pendatang.',
  'Cat-and-Mouse Tension':
    'Permainan kejar-kejaran taktik antara pengejar dan buronan yang saling menguji kecerdikan. Sangat dinamis dengan manuver cerdas dan taruhan yang tinggi.',
  'Investigation Scene':
    'Adegan pencarian bukti, analisis tempat kejadian, atau pengamatan saksi yang membutuhkan ketelitian tinggi. Memberikan nuansa analitis, fokus, dan penuh ketegangan logis.',
  'Paranormal Suspense':
    'Rasa ngeri yang merayap akibat fenomena gaib, bayangan tak wajar, atau kehadiran entitas tak kasat mata. Menghadirkan hawa dingin dan ketakutan naluriah.',
  'Plot Twist Moment':
    'Titik balik cerita yang mengejutkan di mana semua asumsi runtuh oleh kenyataan baru yang mencengangkan. Menampilkan ekspresi syok dan perubahan drastis arah narasi.',

  // Action & Adventure
  'Action Movie Scene':
    'Aksi dinamis dengan koreografi gerak intens, efek visual memukau, dan ritme cepat layaknya film aksi blockbuster. Cocok untuk adegan laga yang memacu adrenalin.',
  'Adventure Drama':
    'Petualangan mengarungi medan tak dikenal yang menguji ketangguhan fisik dan ikatan kebersamaan. Memadukan keindahan alam liar dengan tantangan hidup mati.',
  'Chase Sequence':
    'Aksi kejar-kejaran seru baik berjalan kaki maupun menggunakan kendaraan dalam kecepatan tinggi. Menghadirkan rasa urgensi, bahaya mendesak, dan adrenalin yang memuncak.',
  'Survival Situation':
    'Perjuangan bertahan hidup di tengah kondisi ekstrem atau ancaman mematikan dengan sumber daya terbatas. Menampilkan naluri dasar, determinasi kuat, dan ketahanan fisik.',
  'Heroic Moment':
    'Momen kepahlawanan saat karakter melangkah maju melindungi yang lemah tanpa memedulikan keselamatan dirinya. Memancarkan keberanian mulia dan inspirasi visual yang kuat.',
  'High-Stakes Confrontation':
    'Konfrontasi langsung di mana kegagalan bukanlah pilihan dan hasil akhir menentukan nasib besar. Menghadirkan tatap muka tegang dengan intensitas maksimum.',
  'Spy Thriller':
    'Misi intelijen rahasia yang dipenuhi infiltrasi cerdik, penyamaran rapi, dan risiko terbongkar yang mendebarkan. Menghadirkan aksi elegan, terukur, dan penuh ketegangan sunyi.',
  'Rescue Mission':
    'Operasi penyelamatan berpacu dengan waktu untuk menyelamatkan target penting dari bahaya besar. Menghadirkan koordinasi taktis, ketegangan tinggi, dan tekad tanpa kompromi.',
  'Martial Arts Cinematic':
    'Koreografi seni bela diri yang presisi, estetis, dan sarat filosofi pertarungan tubuh. Menonjolkan kelincahan, fokus mata, dan benturan tenaga yang seimbang.',
  'Epic Showdown':
    'Puncak pertarungan legendaris antara dua pihak berkekuatan seimbang di arena dramatis. Menjadi klimaks visual dengan dampak dramatis yang luar biasa.',

  // Slice of Life
  'Everyday Realism':
    'Potret kehidupan harian apa adanya dengan ketulusan momen sederhana tanpa drama berlebihan. Mengedepankan keindahan rutinitas yang menenangkan dan realistis.',
  'Domestic Life':
    'Kehangatan suasana rumah tangga seperti memasak bersama, menyiram tanaman, atau beristirahat santai di ruang keluarga. Menggambarkan kedamaian dan kenyamanan ruang privat.',
  'Workplace Interaction':
    'Dinamika relasi di lingkungan kerja, diskusi meja kerja, atau obrolan santai di pantry kantor. Menampilkan profesionalisme yang berpadu dengan sisi manusiawi.',
  'Casual Conversation':
    'Obrolan santai di kedai kopi atau bangku taman dengan gestur santai dan tawa renyah. Sangat natural untuk membangun chemistry persahabatan yang otentik.',
  'Unexpected Daily Encounter':
    'Pertemuan kebetulan di jalan, pasar, atau halte yang menyuntikkan warna baru dalam rutinitas. Memberi sentuhan serendipitas yang manis dan realistis.',
  'Neighborhood Story':
    'Kehidupan bertetangga yang ramah dengan sapaan akrab, suasana pemukiman yang hidup, dan kebersamaan sosial dalam skala komunitas lokal.',
  'Travel Moment':
    'Momen menikmati perjalanan santai, mengamati pemandangan dari jendela kereta, atau menikmati kuliner lokal. Menghadirkan sensasi jeda dan eksplorasi yang menyenangkan.',
  'Family Gathering':
    'Keriuhan makan bersama keluarga besar, berbagi cerita lintas generasi, dan tawa hangat di meja makan. Menampilkan kerukunan dan kekayaan tradisi kekeluargaan.',
  'Behind-the-Scenes Moment':
    'Momen jujur di balik layar persiapan suatu acara atau pekerjaan saat lelah terbayar senyuman. Menangkap sisi autentik manusia yang paling tulus.',
  'Authentic Candid Photography':
    'Tangkapan spontan tanpa pose terencana yang menangkap emosi alami, tatapan jujur, dan gestur tubuh apa adanya. Sangat hidup dan bernyawa secara visual.',

  // Fantasy & Supernatural
  'Dark Fantasy':
    'Fantasi bernuansa kelam dengan sihir misterius, makhluk mitos berbahaya, dan dunia yang keras. Menghadirkan atmosfer misterius, bayangan pekat, dan kekuatan tersembunyi.',
  'Magical Realism':
    'Sentuhan keajaiban halus yang membaur secara wajar di tengah dunia nyata sehari-hari. Memberikan nuansa puitis, keajaiban sunyi, dan pesona filosofis.',
  'Mythological Drama':
    'Narasi berakar pada mitologi kuno, takdir para dewa, atau legenda kepahlawanan berkekuatan agung. Membawa aura sakral, monumental, dan bernilai sejarah tinggi.',
  'Supernatural Mystery':
    'Peristiwa janggal di luar nalar yang menuntut penyelidikan pada fenomena gaib dan rahasia kuno. Mengundang rasa ingin tahu yang mendalam bercampur misteri.',
  'Gothic Atmosphere':
    'Estetika gotik megah dengan bangunan tua, pencahayaan lilin temaram, kabut pekat, dan melankolia yang elegan. Menghadirkan keindahan misterius yang memikat.',
  'Dreamlike Narrative':
    'Alur visual bagaikan mimpi dengan logika surealis, transisi mengalir bebas, dan estetika etereal yang membius. Mengaburkan batas antara khayalan dan kenyataan.',
  'Enchanted Encounter':
    'Pertemuan magis dengan sosok misterius di hutan ajaib atau tempat tersembunyi yang bercahaya lembut. Penuh pesona keajaiban dan rasa takjub yang murni.',
  'Fantasy Adventure':
    'Petualangan menjelajahi dunia fantasi luas penuh artefak kuno, mantra sihir, dan makhluk luar biasa. Menghadirkan semangat eksplorasi dan heroisme imajinatif.',
  'Paranormal Romance':
    'Cinta beda dimensi antara manusia dengan sosok berkekuatan gaib yang sarat rintangan takdir. Dipenuhi daya tarik misterius dan pengorbanan emosional yang pekat.',
  'Surreal Visual Storytelling':
    'Cerita dengan metafora visual kuat, distorsi realitas yang artistik, dan simbolisme mendalam. Memancing interpretasi imajinatif dan kepuasan estetika seni tinggi.',

  // Period & Cultural Drama
  'Historical Drama':
    'Drama berlatar era sejarah tertentu dengan akurasi busana, arsitektur masa lampau, dan tata krama klasik. Menghidupkan kembali elegansi masa lalu secara autentik.',
  'Traditional Indonesian Story':
    'Cerita yang kental dengan nilai kearifan lokal Nusantara, busana daerah, dan filosofi hidup masyarakat tradisional Indonesia. Sangat kaya makna dan identitas budaya.',
  'Javanese Cultural Atmosphere':
    'Keanggunan budaya Jawa dengan alunan gamelan lembut, tata busana batik halus, suasana keraton, dan etika kesopanan yang syahdu. Menghadirkan ketenangan batin dan keagungan tradisi.',
  'Vintage Romance':
    'Romansa klasik era tempo doeloe dengan surat bertinta, kencan klasik, dan kelembutan tutur kata yang bersahaja. Menghadirkan nostalgia asmara yang manis dan abadi.',
  'Period Film Aesthetic':
    'Estetika sinema era klasik dengan palet warna hangat bernuansa seluloid, tekstur film vintage, dan tata artistik autentik. Menghasilkan visual bernilai seni tinggi.',
  'Royal Court Intrigue':
    'Intrik perebutan kekuasaan, diplomasi rahasia, dan percaturan politik di lingkungan istana megah. Dipenuhi tatapan tajam di balik senyum istana yang penuh siasat.',
  'Traditional Village Life':
    'Kesederhanaan hidup di pedesaan tradisional yang rukun, persawahan hijau, dan gotong royong warga. Menghadirkan kedamaian jiwa yang jauh dari hiruk pikuk modern.',
  'Nostalgic Memories':
    'Kilas balik kenangan manis masa lalu yang menyentuh hati dengan benda-benda kenangan dan senyuman penuh haru. Membangkitkan rasa rindu yang hangat dan mendalam.',
  'Retro Comedy':
    'Humor ceria bergaya era 70-an atau 80-an dengan gaya busana eksentrik, dialog jenaka tempo dulu, dan kekonyolan klasik. Menghibur dengan kepolosan yang menyegarkan.',
  'Heritage Cinematic Drama':
    'Kisah berlatar warisan cagar budaya yang menyoroti pelestarian nilai luhur dan kebanggaan peradaban bangsa. Berwibawa, megah, dan kaya pesan moral.',

  // Social & Human Interaction
  'Awkward First Meeting':
    'Pertemuan pertama yang kaku dengan senyum ragu, salah tingkah, dan kebingungan memulai obrolan. Sangat relatable dan menggambarkan kerapuhan awal komunikasi.',
  'Friendly Rivalry':
    'Persaingan sehat yang memicu motivasi dengan saling melempar tantangan disertai senyuman sportif. Menunjukkan respek tinggi di balik kompetisi yang ketat.',
  'Unexpected Kindness':
    'Kebaikan spontan tanpa pamrih dari orang yang tak dikenal yang mencairkan kepenatan hati. Menghadirkan rasa haru dan memperlihatkan sisi terbaik kemanusiaan.',
  'Secret Admiration':
    'Mengagumi seseorang dari kejauhan dengan tatapan teduh yang terjaga agar tak ketahuan. Menghadirkan rasa deg-degan manis dan kelembutan perasaan terpendam.',
  'Miscommunication':
    'Salah paham dalam percakapan yang memicu reaksi lucu atau drama kecil sebelum kebenaran terungkap. Menunjukkan dinamika unik interaksi manusia sehari-hari.',
  'Power Dynamics in Conversation':
    'Perang pengaruh dan dominasi halus dalam dialog formal atau tatap muka penting. Menonjolkan bahasa tubuh tegas, kontak mata mantap, dan ketenangan berwibawa.',
  'Negotiation & Persuasion':
    'Seni meyakinkan lawan bicara melalui argumen cerdas, senyuman meyakinkan, dan strategi negosiasi matang. Menampilkan kecerdasan diplomatik dan karisma tinggi.',
  'Public Embarrassment':
    'Momen salah tingkah atau kejadian memalukan di depan umum yang direspons dengan tawa canggung atau usaha menutupinya. Menghadirkan empati dan kelucuan manusiawi.',
  'Emotional Confrontation':
    'Pertemuan terbuka untuk menumpahkan unek-unek yang lama terpendam secara jujur dan transparan. Menghasilkan katarsis emosional yang melegakan kedua pihak.',
  'Unexpected Friendship':
    'Persahabatan tak terduga yang terjalin antara dua kepribadian yang bertolak belakang karena situasi yang mempertemukan mereka. Menghangatkan hati dengan pesan inklusivitas.',

  // Commercial & Editorial Storytelling
  'Commercial Lifestyle':
    'Narasi gaya hidup modern yang aspiratif, bersih, dan berkelas untuk mempromosikan citra hidup ideal. Sangat cocok untuk visual produk gaya hidup premium.',
  'Luxury Editorial':
    'Menampilkan kemewahan eksklusif dengan pencahayaan artistik tinggi, busana haute couture, dan aura glamor tak tertandingi. Menonjolkan prestise dan kesempurnaan detail.',
  'Fashion Campaign':
    'Komposisi visual berani yang menonjolkan tren busana, pose model profesional, dan arahan seni yang memukau. Berdaya pikat visual kuat layaknya halaman majalah mode dunia.',
  'Beauty Editorial':
    'Fokus pada kecantikan wajah, kejernihan kulit alami, sapuan tata rias presisi, dan sorotan mata yang memikat. Sangat ideal untuk kampanye kosmetik dan perawatan diri.',
  'Lifestyle Advertising':
    'Visual promosi yang memadukan aktivitas harian penuh energi dengan produk unggulan secara luwes dan alami. Menularkan semangat hidup positif dan modern.',
  'Professional Portrait Story':
    'Potret profesional berkarakter kuat yang menonjolkan keahlian, rasa percaya diri, dan kredibilitas sosok. Cocok untuk profil eksekutif atau tokoh inspiratif.',
  'Brand Campaign Aesthetic':
    'Konsep visual terpadu dengan palet warna brand yang khas, penceritaan terarah, dan daya ingat tinggi. Menanamkan identitas merek secara elegan dan berkesan.',
  'Magazine Editorial':
    'Tata letak dan arahan visual setingkat majalah internasional dengan cerita tematik yang berbobot seni. Menggabungkan narasi visual dan estetika desain kontemporer.',
  'Documentary Lifestyle':
    'Pendekatan editorial yang menangkap momen kerja dan kehidupan asli tanpa kepalsuan gaya studio. Menampilkan keaslian aktivitas dengan estetika visual berkelas.',
  'Authentic Human Moments':
    'Sorotan pada ekspresi tulus, senyuman lepas, atau kontak hangat antar individu dalam balutan visual berkualitas tinggi. Menghubungkan emosi audiens secara langsung dan mendalam.',

  // Professional & Studio Photography
  'Professional Studio Portrait':
    'Potret studio profesional dengan pencahayaan seimbang (three-point lighting), ketajaman fokus tinggi pada mata, dan latar belakang studio bersih atau gradasi halus. Ideal untuk portofolio profesional, profil resmi, atau foto studio berkualitas tinggi.',
  'Corporate & Executive Portrait':
    'Foto formal eksekutif dan korporat yang memancarkan kewibawaan, kepercayaan diri, dan profesionalisme. Menggunakan busana bisnis formal (setelan jas atau blazer rapi), postur tegak meyakinkan, pencahayaan studio terarah, dan latar netral atau kantor modern minimalis yang elegan.',
  'Personal Branding Portrait':
    'Potret personal branding modern untuk kreator, profesional kreatif, dan entrepreneur. Menampilkan pose dinamis semi-formal atau kasual elegan, ekspresi ramah dan berkarisma, pencahayaan alami atau studio kontemporer, dan latar yang bersih serta estetis.',
  'Beauty & Glamour Portrait':
    'Fotografi kecantikan close-up ekstrem yang menonjolkan kehalusan kulit, tata rias presisi, dan kilau mata memikat. Menggunakan pencahayaan beauty dish atau ring light yang merata dan lembut, sudut pengambilan gambar ketat (tight framing), dan detail kosmetik yang sempurna.',
  'Fashion Editorial Studio':
    'Fotografi mode studio bergaya editorial majalah dengan arahan pose artistik tingkat tinggi, busana berani dan terstruktur, serta pencahayaan dramatis. Menampilkan ekspresi high-fashion, komposisi visual yang kuat, dan estetika visual kelas atas.',
  'Fine Art Portrait':
    'Potret seni rupa klasik yang terinspirasi oleh lukisan mahakarya Rembrandt atau seni modern. Menampilkan pencahayaan dramatis terarah (Rembrandt lighting dengan segitiga cahaya di pipi), latar kanvas bertekstur gelap, ekspresi kontemplatif mendalam, dan tonalitas warna yang puitis.',
  'Dramatic Studio Portrait':
    'Potret studio berkarakter kuat dengan kontras pencahayaan ekstrem (split lighting atau bayangan tajam). Menonjolkan kontur tulang wajah, tatapan intens, dan siluet tegas dengan latar belakang hitam pekat atau atmosferik gelap.',
  'Passport & ID Portrait':
    'Foto formal standar identitas resmi (paspor, visa, KTP) dengan posisi wajah tepat menghadap lurus ke kamera (front-facing), kedua telinga terlihat jelas, pencahayaan merata tanpa bayangan tajam di wajah, latar belakang polos putih/merah/biru solid, dan ekspresi netral formal dengan mulut tertutup.',
  'Graduation Portrait':
    'Foto wisuda formal yang merayakan pencapaian akademik. Menampilkan toga, jubah wisuda, topi mortarboard, atau selempang akademik rapi, pose berwibawa memegang ijazah atau tabung kelulusan, senyuman bangga, dan pencahayaan studio hangat dengan latar klasik.',
  'Maternity Portrait':
    'Fotografi kehamilan artistik yang merayakan keindahan masa mengandung. Menonjolkan lekuk perut ibu hamil dengan pose lembut menopang perut, busana gaun hamil anggun berbahan jatuh atau flowing sheer, pencahayaan lembut bernuansa hangat (ethereal soft light), dan atmosfer penuh kasih sayang.',
  'Newborn & Baby Portrait':
    'Fotografi studio bayi dan bayi baru lahir dengan pose tidur melingkar yang nyaman (swaddled), bedong kain bertekstur lembut, properti keranjang atau selimut rajut hangat, pencahayaan sangat lembut tanpa kilatan keras (diffused soft light), dan nuansa pastel yang tenang serta aman.',
  'Family & Group Portrait':
    'Foto kelompok dan keluarga multi-generasi yang tertata harmonis (group blocking berjenjang). Menggunakan busana dengan palet warna terkoordinasi rapi, ekspresi bahagia dan kebersamaan hangat, pencahayaan studio yang merata ke seluruh anggota, dan komposisi seimbang.',
  'Prewedding & Couple Portrait':
    'Foto pasangan pranikah (prewedding) bernuansa romantis dan elegan. Menampilkan gaun malam atau busana formal pengantin, interaksi intim seperti saling menatap atau bergandengan tangan, pencahayaan studio glamor atau sinematik lembut, dan latar belakang estetis bertema cinta.',
  'Couple & Anniversary Portrait':
    'Potret perayaan hari jadi atau kebersamaan pasangan yang menampilkan kedewasaan hubungan, kehangatan emosional, dan ikatan mendalam. Pose berdampingan yang santai namun bermakna, senyuman tulus, pencahayaan studio hangat, dan busana serasi.',
  'Commercial Product Photography':
    'Fotografi produk komersial profesional berkualitas iklan cetak dan digital. Menampilkan tata cahaya presisi (tabletop lighting dengan reflektor dan diffuser), bayangan produk teratur, ketajaman material maksimal (kaca, logam, tekstil), dan latar belakang tak berujung (seamless infinity cove).',
  'E-commerce Catalog Photography':
    'Foto katalog e-commerce yang bersih, fungsional, dan akurat untuk platform belanja online. Menampilkan produk atau model berpakaian dengan warna akurat, latar belakang putih bersih (pure white background RGB 255), pencahayaan terang merata tanpa bayangan mengganggu, dan sudut pandang jelas.',
  'High-Key Studio Photography':
    'Teknik pencahayaan studio high-key yang dominan terang, cerah, dan minim bayangan gelap. Menghadirkan atmosfer ceria, bersih, modern, dan optimis dengan latar belakang putih atau pastel terang, pencahayaan banjir yang lembut, dan kontras tonal rendah.',
  'Low-Key Studio Photography':
    'Teknik pencahayaan studio low-key yang dominan gelap, dramatis, dan misterius. Menghadirkan rasio kontras tinggi dengan bayangan pekat mendalam, pencahayaan samping atau rim cahaya tipis yang menonjolkan siluet dan kontur, serta latar belakang hitam atau gelap pekat.',
};

export function getStoryStyleDescription(styleName: string): string {
  if (STORY_STYLE_DESCRIPTIONS[styleName]) {
    return STORY_STYLE_DESCRIPTIONS[styleName];
  }
  if (styleName && styleName.trim()) {
    return `Gaya cerita kustom: "${styleName.trim()}". Mengarahkan alur cerita, karakter, dan atmosfer adegan sesuai deskripsi kustom yang Anda tentukan.`;
  }
  return 'Gaya cerita kustom yang ditentukan secara mandiri oleh pengguna untuk memberikan arahan alur narasi, suasana, dan karakter khusus sesuai visi kreatif Anda.';
}

export const VISUAL_STYLE_DIRECTIVES: Record<string, string> = {
  // Mature & Sensual - 19 Single Adult Female Substyles
  'Soft Sensuality':
    'Soft sensuality aesthetic, natural feminine elegance, graceful relaxed posture with gently curved spine, serene calm facial expression, soft diffused daylight, shallow depth of field, single adult female subject only.',
  'Feminine & Delicate':
    'Delicate feminine visual style, fluid poetic body lines, gentle head tilt with fingertips grazing hair or cheek, dreamy romantic gaze, ethereal backlit rim lighting, soft translucent glow, single adult female subject only.',
  'Confident & Alluring':
    'Confident alluring portraiture, magnetic direct eye contact with knowing subtle smile, poised arched posture radiating self-assurance, polished studio illumination with crisp eye catchlights, single adult female subject only.',
  'Casual Sensual Lifestyle':
    'Casual sensual lifestyle aesthetic, candid lounging posture on comfortable indoor sofa or armchair, relaxed authentic body language, warm morning sun streaming through curtains, natural unforced realism, single adult female subject only.',
  'Intimate & Cozy':
    'Intimate and cozy atmosphere, snug relaxed pose among soft blankets and linen, peaceful serene expression, warm amber bedside lighting, deep comforting shadows, tactile textile depth, single adult female subject only.',
  'Subtle Teasing':
    'Subtle playful teasing nuance, coquettish leaning gesture, playful lower lip bite and mischievous sparkle in eyes, bright crisp ambient illumination, engaging intimate perspective, single adult female subject only.',
  'Bold Sensual Posing':
    'Bold sensual posing, dynamic body contours with arched spine and hands swept through hair, fierce intense gaze with parted lips, sculpted directional sidelight carving feminine silhouette, single adult female subject only.',
  'Provocative Reclining':
    'Provocative reclining composition on plush bed or chaise lounge, elongated body lines with one bent knee, sultry intoxicating gaze, moody low-angle framing, deep atmospheric shadows, single adult female subject only.',
  'Sultry Over-the-Shoulder':
    'Sultry over-the-shoulder portraiture, arched spine turned partially away, head turned back with piercing alluring gaze, crisp rim light tracing shoulder line and jaw contour, single adult female subject only.',
  'Dominant & Commanding Pose':
    'Dominant commanding sensual pose, elevated chin with penetrating sovereign stare, statuesque posture with decisive hand placement, dramatic low-angle framing, hard-edged editorial contrast, single adult female subject only.',
  'Intense Erotic Expression':
    'Intense erotic expression close-up, breathless parted lips and arched throat, intense passionate gaze with micro-expressions of raw desire, tight focal depth on facial contours, warm specular skin highlights, single adult female subject only.',
  'Boudoir Elegance':
    'Classic boudoir elegance, refined seated posture at vanity or antique settee, aristocratic calm demeanor, soft window light diffused through lace curtains, luxurious vintage bedroom ambiance, single adult female subject only.',
  'Adult Glamour Magazine':
    'Adult glamour magazine editorial style, glossy vibrant color saturation, dynamic stylized posing with arched hips, radiant polished smile and sparkling eyes, wrap-around high-key beauty lighting, single adult female subject only.',
  'Luxury Lingerie Editorial':
    'Luxury lingerie editorial photography, high-fashion statuesque posture, refined fabric interaction showing silk and delicate lace drape, high-fashion aloof gaze, soft architectural lighting on premium materials, single adult female subject only.',
  'Provocative Pin-Up Glamour':
    'Provocative retro pin-up glamour, classic vintage hourglass posing with arched back and kicked heel, vivacious playful expression with classic styling, saturated warm Golden Age studio illumination, single adult female subject only.',
  'Glamour & Seduction':
    'High glamour and seduction aesthetic, seductive femme fatale S-curve posture, smoldering magnetic gaze with lowered eyelids, warm ambient tungsten and candlelight reflections, rich opulent atmosphere, single adult female subject only.',
  'Artistic Erotic Fine Art':
    'Artistic erotic fine art photography, sculptural bodily geometry, dramatic chiaroscuro lighting isolating anatomical curves against deep black shadows, meditative introspective expression, museum gallery aesthetic, single adult female subject only.',
  'Implied Nude Fine Art':
    'Implied fine art aesthetic, poetic silhouette partially veiled by Venetian blind shadows or translucent sheer drape, artistic strategic blocking, soulful contemplative expression, high-contrast monochrome tonal graduation, single adult female subject only.',
  'Classic Erotic Glamour':
    'Classic European erotic glamour, 1970s cinematic 35mm film grain texture, effortless uninhibited reclining pose, melancholic alluring gaze with parted lips, warm vintage color palette with soft vignetting, single adult female subject only.',

  // Mature & Sensual - Visual Relationship Styles
  'Intense Adult Intimacy':
    'Close-to-medium intimate framing, deep meaningful eye contact, natural physical closeness, gentle yet deliberate touch (fingertips touching jawline or intertwined hands), warm low-key lighting, shallow depth of field, authentic emotional vulnerability, and realistic adult anatomy.',
  'Passionate Romantic Encounter':
    'Electric interpersonal chemistry, dynamic natural couple posing, slightly parted breathless lips, cinematic warm key lighting with subtle rim light, close physical embrace, and expressive body language conveying intense romantic attraction.',
  'Seductive Couple Interaction':
    'Seductive mutual allure, flirtatious eye contact, subtle confident smirks, bodies leaning inward with intentional posture, sophisticated styling (tailored eveningwear or fine casual fabrics), and soft moody ambient lighting.',
  'Intimate Bedroom Atmosphere':
    'Private sanctuary setting, soft warm diffused bedside lighting, high-fidelity textile rendering (crisp linen, silk sheets, soft blankets), relaxed reclining or seated couple postures, and an intimate cozy cinematic mood.',
  'Passionate Kissing':
    'Anatomically accurate and believable kiss between adult partners, natural head tilt angle, realistic soft lip contact, closed or fluttering eyelids, hands gently cradling cheek or neck, and intimate focal composition with creamy background bokeh.',
  'Physical Romantic Chemistry':
    'Clear physical magnetism through body alignment, synchronized postures, hands resting naturally on waist or shoulder, close interpersonal distance, authentic muscle contours, and confident mature posture.',
  'Afterglow Couple Portrait':
    'Serene post-romantic tranquility, gentle emotional warmth, relaxed facial muscles with calm content expressions, tender entwined limbs or resting head on chest/shoulder, and soft golden-hour or gentle morning dawn illumination.',
  'Forbidden Adult Attraction':
    'High-stakes emotional tension, stolen guarded glances, hesitant proximity, subtle emotional conflict visible in facial micro-expressions, rich chiaroscuro shadows, and an atmospheric secretive setting.',
  'Dominant–Submissive Aesthetic':
    'Consensual adult dynamic with clear visual contrast; combine an assertive upright posture and commanding gaze with a relaxed receptive stance, deliberate physical positioning, structured tasteful or editorial wardrobe, and dramatic directional lighting.',
  'Mature Relationship Tension':
    'Heavy unspoken romantic tension, magnetic interpersonal distance, held unwavering eye contact, palpable space between subjects, nuanced jaw/neck tension, and evocative cinematic framing with depth.',
  'Sensual Couple Boudoir':
    'Fine-art boudoir portraiture, luxurious fabric textures (satin robe, delicate lace, sheer silk, unbuttoned tailored shirt), flattering soft-box or directional window illumination, dignified artistic shadows, and elegant sensual composition without vulgarity.',
  'Unfiltered Adult Sensuality':
    'Direct and unembellished adult sensuality, explicit anatomical fidelity, natural skin warmth and genuine contact points, candid unposed postures, realistic fabric folds and drape, authentic eye contact, and atmospheric natural lighting.',
  'Sensual & Alluring':
    'Sophisticated sensual elegance, graceful silhouette, magnetic captivating gaze, subtle hint of a smile, flattering portrait lighting, and tasteful styling.',
  'Confident Adult Flirtation':
    'Charismatic and playful adult allure, confident eye contact, cheeky or knowing smirk, open relaxed posture, and stylish modern aesthetics.',
  'Seductive Atmosphere':
    'Immersive sensual environment, dim moody lighting, warm rich color palette, deep soft shadows, tactile textures, and intimate visual depth.',
  'Intimate Romantic Tension':
    'Suspended romantic anticipation in close proximity, held breath, intense eye contact, parted lips, hands hovering just before touch, and tight cinematic framing.',
  'Elegant Sensuality':
    'High-end luxury sensuality, dignified posture, couture or silk garments, statuesque poise, and refined clean editorial illumination.',
  'Bold Romantic Chemistry':
    'Direct, unapologetic reciprocal attraction, decisive body language, minimal interpersonal space, shared intense gaze, and vibrant cinematic highlights.',
  'Mysterious Attraction':
    'Enigmatic allure, partial shadow across features, intriguing sidelight, secretive subtle expression, and captivating mysterious gaze.',
  'Mature Romantic Drama':
    'Complex adult romance, layered facial expressions showing emotional depth, rich textured color palette, and cinematic depth of field.',
  'Subtle Suggestiveness':
    'Understated sensuality, micro-expressions, light touch of fingertips, glance over the shoulder, and soft ambient illumination.',
  'Alluring Character Interaction':
    'Engaging face-to-face dynamic between adults, responsive body language, synchronized gestures, compelling visual connection, and balanced two-shot framing.',

  // Professional & Studio Photography
  'Professional Studio Portrait':
    'Professional studio portrait with balanced three-point lighting (soft key light, gentle fill, crisp rim light), tack-sharp focus on the eyes with natural catchlights, neutral seamless studio backdrop or subtle textured canvas, dignified confident posture, natural relaxed expression, authentic skin tones and micro-texture, 85mm portrait lens perspective.',
  'Corporate & Executive Portrait':
    'Corporate executive portrait, confident and authoritative posture, tailored business attire (formal blazer or suit with crisp collar), structured studio lighting with clean soft shadows, subtle executive office or minimalist architectural background with shallow depth of field, poised engaging expression, pristine professional sharpness.',
  'Personal Branding Portrait':
    'Contemporary personal branding portrait, dynamic approachable pose, smart casual or creative professional wardrobe, warm natural studio lighting with soft diffused glow, minimalist aesthetic setting, engaging friendly smile or charismatic direct gaze, clean modern editorial composition.',
  'Beauty & Glamour Portrait':
    'Beauty and glamour close-up portrait, beauty dish lighting creating flawless even skin illumination and distinct circular catchlights in the iris, meticulous makeup definition, razor-sharp focus on eyelashes and lips, soft flattering depth of field, elegant styling, high-end cosmetics campaign aesthetics.',
  'Fashion Editorial Studio':
    'High-fashion studio editorial photography, avant-garde or structured couture styling, bold editorial posing with dynamic angles, sculpted directional lighting with deliberate artistic shadows, stark cyclorama or high-fashion studio set, intense runway-model gaze, 50mm or 70mm fashion lens aesthetic.',
  'Fine Art Portrait':
    'Fine art studio portrait inspired by classical master painting aesthetics, moody Rembrandt lighting with dramatic chiaroscuro and triangular cheek highlight, painterly textured canvas backdrop, soulful introspective expression, rich muted color palette, poetic emotional depth, museum-grade composition.',
  'Dramatic Studio Portrait':
    'Dramatic studio portrait with high-contrast split or edge lighting, deep sculpted shadows carving facial bone structure, intense piercing gaze, stark black or dark moody studio environment, gritty realistic skin texture, powerful emotional gravity, cinematic medium-close framing.',
  'Passport & ID Portrait':
    'Strict official passport and ID photo specifications: perfectly centered frontal head-and-shoulders composition, subject facing directly into the camera with level shoulders, even flat lighting eliminating shadows on face and backdrop, solid plain white or designated neutral background, formal professional collar, neutral facial expression with natural mouth closed, no head tilt, biometric accuracy.',
  'Graduation Portrait':
    'Formal graduation portrait, pristine academic regalia (graduation gown, mortarboard cap, academic sash/hood), holding diploma scroll with pride, dignified upright stance, beaming celebratory smile, warm studio portrait illumination with subtle rim light, classic portrait studio or library backdrop.',
  'Maternity Portrait':
    'Artistic studio maternity portrait celebrating pregnancy, hands gently cradling baby bump, elegant flowing maternity gown or delicate drape, soft ethereal studio lighting accentuating maternal curves with gentle gradients, serene affectionate expression, warm peaceful color tones, tender celebratory mood.',
  'Newborn & Baby Portrait':
    'Studio newborn baby portrait, peacefully sleeping baby swaddled in soft organic textured knit wraps, cozy basket or plush blanket nest, ultra-soft diffused continuous lighting with gentle feathering, delicate skin details, peaceful serene mood, warm pastel color palette, safe tender composition.',
  'Family & Group Portrait':
    'Harmonious multi-person family studio portrait, multi-level tiered group posing with natural interaction, coordinated color palette attire, broad even studio lighting illuminating every individual clearly without cast shadows, genuine joyful smiles and familial warmth, balanced wide-to-medium group framing.',
  'Prewedding & Couple Portrait':
    'Elegant studio prewedding couple portrait, formal eveningwear or tailored bridal gown and suit, romantic intimate posing (gently embracing, holding hands, loving mutual gaze), soft glamorous studio key light with romantic hair rim light, dreamy backdrop or floral aesthetic set, deep emotional romance.',
  'Couple & Anniversary Portrait':
    'Couple anniversary portrait, comfortable affectionate couple poses reflecting deep mutual bond, complementary coordinated outfits, warm flattering studio portrait lighting, gentle authentic smiles, intimate medium shot framing, timeless enduring love aesthetic.',
  'Commercial Product Photography':
    'Commercial product photography, pristine studio tabletop lighting with calibrated highlights and gradient reflections, crisp focus across all product surfaces and typography, seamless infinity background or podium staging, commercial advertising standard, zero unwanted glare.',
  'E-commerce Catalog Photography':
    'E-commerce catalog photography, pure white seamless background (RGB 255/255/255), bright shadowless wrap-around studio lighting, accurate color fidelity and crisp fabric texture representation, clean commercial standing pose for apparel, sharp multi-angle clarity, optimized for online retail.',
  'High-Key Studio Photography':
    'High-key studio photography, predominantly bright tonal range with minimal deep shadows, luminous white background, high-powered diffused wrap-around lighting, clean uplifting atmosphere, soft gentle contrast, vibrant natural skin tones, airy modern commercial aesthetic.',
  'Low-Key Studio Photography':
    'Low-key studio photography, dark dramatic tonal dominance with deep rich blacks, high contrast lighting ratio, selective rim light or narrow strip-box carving contours and silhouettes out of shadow, mysterious moody atmosphere, striking sculptural form, cinematic chiaroscuro.',
};

export function getStyleVisualDirective(styleName: string): string {
  return VISUAL_STYLE_DIRECTIVES[styleName] || '';
}

export interface MatureSubstyleGroupDef {
  id: string;
  title: string;
  substyles: string[];
}

export const MATURE_SUBSTYLE_GROUPS: MatureSubstyleGroupDef[] = [
  {
    id: 'group-a',
    title: 'A. Soft & Feminine Sensuality',
    substyles: ['Soft Sensuality', 'Feminine & Delicate', 'Confident & Alluring'],
  },
  {
    id: 'group-b',
    title: 'B. Lifestyle & Intimate',
    substyles: ['Casual Sensual Lifestyle', 'Intimate & Cozy', 'Subtle Teasing'],
  },
  {
    id: 'group-c',
    title: 'C. Bold & Provocative Posing',
    substyles: [
      'Bold Sensual Posing',
      'Provocative Reclining',
      'Sultry Over-the-Shoulder',
      'Dominant & Commanding Pose',
      'Intense Erotic Expression',
    ],
  },
  {
    id: 'group-d',
    title: 'D. Boudoir, Glamour & Lingerie Editorial',
    substyles: [
      'Boudoir Elegance',
      'Adult Glamour Magazine',
      'Luxury Lingerie Editorial',
      'Provocative Pin-Up Glamour',
      'Glamour & Seduction',
    ],
  },
  {
    id: 'group-e',
    title: 'E. Erotic Fine Art & Cinematic Expression',
    substyles: ['Artistic Erotic Fine Art', 'Implied Nude Fine Art', 'Classic Erotic Glamour'],
  },
];

export const MATURE_SUBSTYLES: MatureSubstyle[] = [
  // A. Soft & Feminine Sensuality
  {
    id: 'soft-sensuality',
    name: 'Soft Sensuality',
    group: 'Soft & Feminine Sensuality',
    description: 'Sensualitas lembut yang alami, memancarkan keanggunan bersahaja, gestur santai, dan pesona feminin yang menenangkan tanpa pose berlebihan.',
    visualDefinition: 'Natural relaxed feminine sensuality emphasizing organic grace, understated elegance, and intimate authenticity.',
    poseAndBodyLanguage: 'Natural relaxed posture, gentle subtle curve of the spine, relaxed shoulders, hands resting softly on collarbone, cheek, or lap.',
    facialExpression: 'Serene, tender expression, soft parted lips, gentle calm gaze into the lens or thoughtfully off-camera.',
    lightingAndComposition: 'Diffused natural window daylight, soft wrap-around fill light, warm gentle skin tones, medium portrait framing with creamy bokeh.',
    promptDirective: 'Soft sensuality aesthetic, natural feminine elegance, graceful relaxed posture with gently curved spine, serene calm facial expression, soft diffused daylight, shallow depth of field, single adult female subject only.',
  },
  {
    id: 'feminine-delicate',
    name: 'Feminine & Delicate',
    group: 'Soft & Feminine Sensuality',
    description: 'Estetika feminin yang anggun dan rapuh secara artistik, menonjolkan kehalusan detail, lekuk siluet gemulai, dan keanggunan gerak yang puitis.',
    visualDefinition: 'Poetic, delicate feminine visual aesthetic emphasizing soft silhouettes, graceful lines, and tender vulnerability.',
    poseAndBodyLanguage: 'Delicate fluid body lines, gentle head tilt, fingertips lightly grazing hair or neckline, relaxed contrapposto stance.',
    facialExpression: 'Dreamy soft gaze, subtle tender half-smile, introspective and romantic emotional nuance.',
    lightingAndComposition: 'Ethereal backlighting, translucent ambient glow, pastel and muted warm palette, medium-close framing highlighting graceful neck and shoulders.',
    promptDirective: 'Delicate feminine visual style, fluid poetic body lines, gentle head tilt with fingertips grazing hair, dreamy romantic gaze, ethereal backlit rim lighting, soft translucent glow, single adult female subject only.',
  },
  {
    id: 'confident-alluring',
    name: 'Confident & Alluring',
    group: 'Soft & Feminine Sensuality',
    description: 'Daya pikat wanita dewasa yang penuh percaya diri, tatapan magnetis yang memikat langsung ke kamera, dan postur anggun yang memesona.',
    visualDefinition: 'Charismatic adult allure driven by confident self-possession, statuesque poise, and magnetic direct connection.',
    poseAndBodyLanguage: 'Poised upright seated or standing posture with arched back, confident shoulder alignment, relaxed elegant hand placement.',
    facialExpression: 'Captivating direct eye contact, subtle knowing smirk, charismatic and unapologetically self-assured expression.',
    lightingAndComposition: 'Balanced key studio lighting with gentle soft-box fill, clean catchlights in eyes, refined framing emphasizing feminine poise and presence.',
    promptDirective: 'Confident alluring portraiture, magnetic direct eye contact with knowing subtle smile, poised arched posture radiating self-assurance, polished studio illumination with crisp eye catchlights, single adult female subject only.',
  },

  // B. Lifestyle & Intimate
  {
    id: 'casual-sensual-lifestyle',
    name: 'Casual Sensual Lifestyle',
    group: 'Lifestyle & Intimate',
    description: 'Potret gaya hidup kasual yang intim dan autentik di ruang privat, menangkap momen santai harian dengan daya pikat alami tanpa rekayasa.',
    visualDefinition: 'Authentic candid lifestyle sensuality captured within an intimate domestic sanctuary.',
    poseAndBodyLanguage: 'Candid lounging on a plush sofa or armchair, curled legs, relaxed barefoot posture, stretching or reclining naturally.',
    facialExpression: 'Spontaneous warmth, natural relaxed smile or thoughtful candid glance, unposed authenticity.',
    lightingAndComposition: 'Warm morning sunlight streaming through sheer curtains, subtle dust motes, lifestyle candid framing with domestic interior depth.',
    promptDirective: 'Casual sensual lifestyle aesthetic, candid lounging posture on comfortable indoor sofa or armchair, relaxed authentic body language, warm morning sun streaming through curtains, natural unforced realism, single adult female subject only.',
  },
  {
    id: 'intimate-cozy',
    name: 'Intimate & Cozy',
    group: 'Lifestyle & Intimate',
    description: 'Suasana hangat, nyaman, dan intim di lingkungan kamar tidur atau ruang santai, berpadu dengan tekstur selimut lembut dan pencahayaan temaram.',
    visualDefinition: 'Warm sanctuary aesthetic centered on comforting tactile textures, private relaxation, and cozy ambiance.',
    poseAndBodyLanguage: 'Sitting or nestled among plush pillows, arms wrapped gently around knees or holding soft throw blanket, cozy cocoon posture.',
    facialExpression: 'Peaceful affectionate expression, eyes half-lidded or soft-focused, feeling completely at ease and serene.',
    lightingAndComposition: 'Dim warm bedside lamp light, soft candlelight glow, rich tactile textile rendering (linen, knit, silk), intimate medium framing.',
    promptDirective: 'Intimate and cozy atmosphere, snug relaxed pose among soft blankets and linen, peaceful serene expression, warm amber bedside lighting, deep comforting shadows, tactile textile depth, single adult female subject only.',
  },
  {
    id: 'subtle-teasing',
    name: 'Subtle Teasing',
    group: 'Lifestyle & Intimate',
    description: 'Nuansa menggoda yang halus dan menyenangkan melalui bahasa tubuh yang ceria, tatapan nakal, dan gesture kecil yang memancing rasa penasaran.',
    visualDefinition: 'Coquettish, playful sensuality balancing charming lightheartedness with subtle erotic curiosity.',
    poseAndBodyLanguage: 'Playful asymmetrical pose, finger playfully resting near lips or lightly biting lower lip, leaning slightly forward toward the camera.',
    facialExpression: 'Mischievous playful smirk, twinkling lively eyes, coquettish glance filled with flirtatious charisma.',
    lightingAndComposition: 'Bright dynamic ambient lighting, lively specular highlights, engaging intimate perspective drawing viewer into the moment.',
    promptDirective: 'Subtle playful teasing nuance, coquettish leaning gesture, playful lower lip bite and mischievous sparkle in eyes, bright crisp ambient illumination, engaging intimate perspective, single adult female subject only.',
  },

  // C. Bold & Provocative Posing
  {
    id: 'bold-sensual-posing',
    name: 'Bold Sensual Posing',
    group: 'Bold & Provocative Posing',
    description: 'Pose sensual yang tegas dan percaya diri tinggi, menonjolkan lekuk tubuh secara dinamis dengan sudut pengambilan gambar yang artistik dan berani.',
    visualDefinition: 'Assertive, high-impact sensual aesthetic emphasizing sculptural body contours and fearless physical expression.',
    poseAndBodyLanguage: 'Pronounced arch of the back, hands placed deliberately on hips or sweeping through hair, dynamic angular body lines.',
    facialExpression: 'Fierce captivating gaze, parted lips, intense self-awareness and unapologetic sensual confidence.',
    lightingAndComposition: 'Sculpted directional studio lighting, high-contrast side light creating dramatic shadow along body curves, powerful cinematic framing.',
    promptDirective: 'Bold sensual posing, dynamic body contours with arched spine and hands swept through hair, fierce intense gaze with parted lips, sculpted directional sidelight carving feminine silhouette, single adult female subject only.',
  },
  {
    id: 'provocative-reclining',
    name: 'Provocative Reclining',
    group: 'Bold & Provocative Posing',
    description: 'Pose berbaring yang provokatif dan menggoda di atas tempat tidur atau chaise lounge, dengan garis tubuh memanjang dan komposisi visual yang memikat.',
    visualDefinition: 'Alluring horizontal composition celebrating elongated body curves, opulent relaxation, and provocative visual allure.',
    poseAndBodyLanguage: 'Reclining on side or back with one leg bent, elongated torso, relaxed arm draped over head or silk pillow.',
    facialExpression: 'Sultry heavy-lidded eyes, relaxed breathless lips, intoxicating magnetic expression of invitation.',
    lightingAndComposition: 'Moody low-angle or overhead high-angle framing, chiaroscuro lighting draping shadows across the mattress, luxurious textile backdrop.',
    promptDirective: 'Provocative reclining composition on plush bed or chaise lounge, elongated body lines with one bent knee, sultry intoxicating gaze, moody low-angle framing, deep atmospheric shadows, single adult female subject only.',
  },
  {
    id: 'sultry-over-the-shoulder',
    name: 'Sultry Over-the-Shoulder',
    group: 'Bold & Provocative Posing',
    description: 'Tatapan sensual dari balik bahu yang menonjolkan lekuk punggung yang anggun, garis leher memanjang, dan siluet yang memikat.',
    visualDefinition: 'Evocative rear-angle portraiture focusing on spinal curvature, shoulder definition, and dramatic backwards eye contact.',
    poseAndBodyLanguage: 'Torso turned partially away from camera, head rotated back over shoulder, arched upper back, accentuated shoulder blade contour.',
    facialExpression: 'Piercing alluring over-the-shoulder gaze, mysterious subtle smirk, magnetic eye contact across the shoulder.',
    lightingAndComposition: 'Rim lighting accentuating the curve of the spine, shoulders, and jawline, dark minimalist background, tight to medium portrait crop.',
    promptDirective: 'Sultry over-the-shoulder portraiture, arched spine turned partially away, head turned back with piercing alluring gaze, crisp rim light tracing shoulder line and jaw contour, single adult female subject only.',
  },
  {
    id: 'dominant-commanding-pose',
    name: 'Dominant & Commanding Pose',
    group: 'Bold & Provocative Posing',
    description: 'Bahasa tubuh dominan, anggun, dan berwibawa tinggi, menampilkan sosok wanita dewasa yang menguasai ruangan dengan aura kekuasaan yang sensual.',
    visualDefinition: 'Empowered, authoritative sensuality projecting total sovereign control, regal poise, and commanding gaze.',
    poseAndBodyLanguage: 'Tall upright seated or standing posture, chin slightly elevated, legs crossed decisively, authoritative deliberate hand placement.',
    facialExpression: 'Penetrating commanding stare, stoic yet captivating expression, aura of unwavering sovereignty.',
    lightingAndComposition: 'Dramatic low-angle perspective looking slightly upward, hard-edged studio key lighting, deep blacks, statuesque composition.',
    promptDirective: 'Dominant commanding sensual pose, elevated chin with penetrating sovereign stare, statuesque posture with decisive hand placement, dramatic low-angle framing, hard-edged editorial contrast, single adult female subject only.',
  },
  {
    id: 'intense-erotic-expression',
    name: 'Intense Erotic Expression',
    group: 'Bold & Provocative Posing',
    description: 'Fokus pada kedalaman ekspresi emosional yang intens dan sensual, menangkap napas yang tertahan, tatapan menghanyutkan, dan gairah visual yang pekat.',
    visualDefinition: 'Intimate psychological and visceral tension focused on raw facial micro-expressions of heightened passion.',
    poseAndBodyLanguage: 'Tense elongated neck line, arched throat, fingers gripping silk sheets or tangled in hair, arching collarbones.',
    facialExpression: 'Breathless parted lips, dilated focused gaze, intensely passionate facial tension, micro-expressions of raw desire.',
    lightingAndComposition: 'Extreme close-up or tight framing on face, neck, and collarbones, warm specular skin highlights, shallow depth of field.',
    promptDirective: 'Intense erotic expression close-up, breathless parted lips and arched throat, intense passionate gaze with micro-expressions of raw desire, tight focal depth on facial contours, warm specular skin highlights, single adult female subject only.',
  },

  // D. Boudoir, Glamour & Lingerie Editorial
  {
    id: 'boudoir-elegance',
    name: 'Boudoir Elegance',
    group: 'Boudoir, Glamour & Lingerie Editorial',
    description: 'Fotografi boudoir klasik yang mewah dan berkelas, memadukan keindahan ruang tidur privat, dekorasi elegan, dan pesona wanita dewasa yang agung.',
    visualDefinition: 'Timeless fine-art boudoir portraiture blending aristocratic grace, vintage luxury decor, and dignified intimacy.',
    poseAndBodyLanguage: 'Gracefully seated on antique settee or vanity stool, legs crossed at ankles, refined dignified posture with relaxed shoulders.',
    facialExpression: 'Subtle sophisticated smile, calm aristocratic composure, serene confident gaze radiating mature grace.',
    lightingAndComposition: 'Soft diffused window light filtered through French lace drapes, vintage neoclassical interior setting, harmonious classic composition.',
    promptDirective: 'Classic boudoir elegance, refined seated posture at vanity or antique settee, aristocratic calm demeanor, soft window light diffused through lace curtains, luxurious vintage bedroom ambiance, single adult female subject only.',
  },
  {
    id: 'adult-glamour-magazine',
    name: 'Adult Glamour Magazine',
    group: 'Boudoir, Glamour & Lingerie Editorial',
    description: 'Gaya pemotretan majalah glamor dewasa ala editorial 90-an dan modern, dengan pencahayaan terang merata, pose terarah, dan visual memukau.',
    visualDefinition: 'Glossy, high-energy adult glamour publication aesthetic with rich color saturation and studio-mastered polish.',
    poseAndBodyLanguage: 'Glamorous stylized posing, arched back, one hand behind head, arching hips, high-energy editorial body language.',
    facialExpression: 'Radiant glamorous smile or confident sultry pout, sparkling iris catchlights, polished commercial allure.',
    lightingAndComposition: 'Large beauty-dish or wrap-around ring light illumination, clean cyclorama or luxury penthouse set, vibrant colors, tack-sharp focus.',
    promptDirective: 'Adult glamour magazine editorial style, glossy vibrant color saturation, dynamic stylized posing with arched hips, radiant polished smile and sparkling eyes, wrap-around high-key beauty lighting, single adult female subject only.',
  },
  {
    id: 'luxury-lingerie-editorial',
    name: 'Luxury Lingerie Editorial',
    group: 'Boudoir, Glamour & Lingerie Editorial',
    description: 'Fotografi editorial pakaian dalam dan gaun tidur mewah, menonjolkan presisi tekstur sutra, renda Prancis, dan lekuk siluet yang adiluhung.',
    visualDefinition: 'High-fashion haute-couture intimate apparel campaign emphasizing textile drape, artisanal lace, and statuesque elegance.',
    poseAndBodyLanguage: 'High-fashion posture, statuesque lean against marble mantel or silk headboard, relaxed fingertips accentuating delicate fabric drape.',
    facialExpression: 'High-fashion aloof gaze, serene detachment with an undercurrent of sensual confidence, editorial expression.',
    lightingAndComposition: 'Architectural lighting with gentle gradients, luxury interior textures (Carrara marble, silk, polished brass), magazine cover framing.',
    promptDirective: 'Luxury lingerie editorial photography, high-fashion statuesque posture, refined fabric interaction showing silk and delicate lace drape, high-fashion aloof gaze, soft architectural lighting on premium materials, single adult female subject only.',
  },
  {
    id: 'provocative-pin-up-glamour',
    name: 'Provocative Pin-Up Glamour',
    group: 'Boudoir, Glamour & Lingerie Editorial',
    description: 'Sentuhan retro glamor klasik pin-up era emas dengan pose menggoda yang ceria, siluet jam pasir yang tegas, dan estetika vintage berkarakter.',
    visualDefinition: 'Vintage mid-century pin-up aesthetic combining playful theatricality, exaggerated hourglass silhouettes, and warm retro tones.',
    poseAndBodyLanguage: 'Classic hourglass pin-up pose, arched back, kicked-back foot, playful hands on hips or tipping vintage accessory.',
    facialExpression: 'Playful winking eye or charmingly surprised expression, bright bold lipstick smile, vivacious Golden Age energy.',
    lightingAndComposition: 'Warm saturated Technicolor-inspired studio lighting, vintage props, nostalgic 1950s cinematic framing.',
    promptDirective: 'Provocative retro pin-up glamour, classic vintage hourglass posing with arched back and kicked heel, vivacious playful expression with classic styling, saturated warm Golden Age studio illumination, single adult female subject only.',
  },
  {
    id: 'glamour-seduction',
    name: 'Glamour & Seduction',
    group: 'Boudoir, Glamour & Lingerie Editorial',
    description: 'Perpaduan kemewahan busana malam dan daya tarik godaan yang memikat, menghadirkan pesona femme fatale yang anggun dan berbahaya.',
    visualDefinition: 'Opulent femme fatale visual aesthetic combining evening luxury, nocturnal magnetism, and sultry elegance.',
    poseAndBodyLanguage: 'S-curve body posture, leaning against dark polished mahogany or grand staircase railing, fingers toying with evening neckline or jewels.',
    facialExpression: 'Smoldering seductive gaze, lowered eyelids, enigmatic Mona Lisa smile with magnetic intrigue.',
    lightingAndComposition: 'Moody cocktail lounge lighting, warm amber tungsten lamps, glistening reflections on crystal and jewelry, cinematic framing.',
    promptDirective: 'High glamour and seduction aesthetic, seductive femme fatale S-curve posture, smoldering magnetic gaze with lowered eyelids, warm ambient tungsten and candlelight reflections, rich opulent atmosphere, single adult female subject only.',
  },

  // E. Erotic Fine Art & Cinematic Expression
  {
    id: 'artistic-erotic-fine-art',
    name: 'Artistic Erotic Fine Art',
    group: 'Erotic Fine Art & Cinematic Expression',
    description: 'Fotografi seni rupa erotis bernilai estetika museum, memadukan bentuk tubuh manusia sebagai patung hidup melalui permainan bayangan dan cahaya dramatis.',
    visualDefinition: 'Museum-grade fine-art photography treating the human form as living sculpture through dramatic shadow and light.',
    poseAndBodyLanguage: 'Sculptural bodily pose, geometric torso and limb alignments forming abstract harmonious contours.',
    facialExpression: 'Contemplative introspective gaze, meditative calmness, timeless artistic gravity.',
    lightingAndComposition: 'Extreme chiaroscuro lighting, deep black shadows carving pure form, textured canvas backdrop, gallery-standard tonal grading.',
    promptDirective: 'Artistic erotic fine art photography, sculptural bodily geometry, dramatic chiaroscuro lighting isolating anatomical curves against deep black shadows, meditative introspective expression, museum gallery aesthetic, single adult female subject only.',
  },
  {
    id: 'implied-nude-fine-art',
    name: 'Implied Nude Fine Art',
    group: 'Erotic Fine Art & Cinematic Expression',
    description: 'Seni rupa tersirat (implied) yang mengandalkan siluet, bayangan arsitektural, tirai tipis, atau properti untuk menyamarkan tubuh secara puitis dan bermartabat.',
    visualDefinition: 'Artful implied nude aesthetic relying on poetic veiling, structural shadows, and graceful strategic concealment.',
    poseAndBodyLanguage: 'Poetic positioning behind translucent sheer fabric or shadow blinds, curled silhouette, natural modesty preserved through artistic blocking.',
    facialExpression: 'Soulful poetic expression, eyes closed or lost in thought, serene artistic vulnerability.',
    lightingAndComposition: 'Venetian blind shadow patterns (gobo lighting) or backlit sheer drapes, subtle gradient rim lighting, high-contrast monochrome tonal graduation.',
    promptDirective: 'Implied fine art aesthetic, poetic silhouette partially veiled by Venetian blind shadows or translucent sheer drape, artistic strategic blocking, soulful contemplative expression, high-contrast monochrome tonal graduation, single adult female subject only.',
  },
  {
    id: 'classic-erotic-glamour',
    name: 'Classic Erotic Glamour',
    group: 'Erotic Fine Art & Cinematic Expression',
    description: 'Gaya glamor erotis klasik era sinema Eropa 1970-1980-an, menghadirkan estetika seluloid film 35mm, butiran film halus, dan nostalgia sensual yang abadi.',
    visualDefinition: 'European arthouse erotic cinema aesthetic inspired by 1970s and 1980s French and Italian master cinematography.',
    poseAndBodyLanguage: 'Effortless European cinematic posture, reclining on velvet armchair, relaxed uninhibited grace and natural poise.',
    facialExpression: 'Melancholic yet alluring gaze, parted lips, timeless cinematic nostalgia and romantic longing.',
    lightingAndComposition: 'Warm vintage 35mm film grain, slightly muted earth tones, soft optical vignette, romantic European new-wave cinema lighting.',
    promptDirective: 'Classic European erotic glamour, 1970s cinematic 35mm film grain texture, effortless uninhibited reclining pose, melancholic alluring gaze with parted lips, warm vintage color palette with soft vignetting, single adult female subject only.',
  },
];

export const MATURE_INTENSITY_DIRECTIVES: Record<
  MatureSensualIntensity,
  { label: string; desc: string; directive: string }
> = {
  Soft: {
    label: 'Soft',
    desc: 'Sensualitas halus dan natural',
    directive:
      'Soft intensity: subtle, organic sensuality with relaxed graceful posture, soft ambient lighting, understated allure, and warm natural framing.',
  },
  Bold: {
    label: 'Bold',
    desc: 'Pose lebih tegas dan ekspresif',
    directive:
      'Bold intensity: assertive, expressive body language, confident direct eye contact, sculpted directional lighting with pronounced highlights, and dynamic contours.',
  },
  Provocative: {
    label: 'Provocative',
    desc: 'Bahasa tubuh dan framing lebih berani',
    directive:
      'Provocative intensity: daring body language, intimate and alluring angles, intense magnetic gaze, evocative chiaroscuro shadows, and high visual tension.',
  },
  'High Glamour': {
    label: 'High Glamour',
    desc: 'Estetika editorial dewasa, pose terarah, dan pencahayaan dramatis',
    directive:
      'High Glamour intensity: polished adult high-fashion editorial aesthetic, meticulously directed dramatic poses, cinematic studio key and rim illumination, and opulent visual elegance.',
  },
};

export const SINGLE_ADULT_FEMALE_DIRECTIVE = `[SINGLE ADULT FEMALE SUBJECT MANDATE]:
- Exactly ONE adult female as the sole human subject in the entire image.
- STRICTLY NO partner, secondary model, background extras, or additional human figures.
- NO extra people visible in background, reflections, mirrors, posters, artwork, or screens.
- Absolutely NO interpersonal human interaction scenes.
- Non-human objects (luxury furniture, ornate mirrors, silk/velvet drapes, bed, studio props) are permitted.
- Preserve facial identity, adult age, and body proportions precisely from reference images.
- Substyle must NEVER alter or override user-specified outfit, location, locked reference pose, or protected character attributes.`;

export function getMatureSubstyleByName(name: string): MatureSubstyle | undefined {
  return MATURE_SUBSTYLES.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
}

export function isMatureSensualSubstyle(name: string): boolean {
  if (!name) return false;
  return MATURE_SUBSTYLES.some((s) => s.name.toLowerCase() === name.trim().toLowerCase());
}

export function isMatureCoupleStyle(name: string): boolean {
  if (!name) return false;
  return MATURE_COUPLE_STYLES.some((s) => s.toLowerCase() === name.trim().toLowerCase());
}

export function getIntensityDirective(intensity: MatureSensualIntensity): string {
  return MATURE_INTENSITY_DIRECTIVES[intensity]?.directive || MATURE_INTENSITY_DIRECTIVES.Soft.directive;
}



