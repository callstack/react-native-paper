import { Platform } from 'react-native';

type ReducerAction<T extends keyof State> = {
  payload: State[T];
  type: T;
};

type IconsColor = {
  flatLeftIcon: string | undefined;
  flatRightIcon: string | undefined;
  outlineLeftIcon: string | undefined;
  outlineRightIcon: string | undefined;
  customIcon: string | undefined;
};

export type State = {
  text: string;
  customIconText: string;
  name: string;
  outlinedText: string;
  largeText: string;
  flatTextPassword: string;
  outlinedLargeText: string;
  outlinedTextPassword: string;
  nameNoPadding: string;
  nameRequired: string;
  flatDenseText: string;
  flatDense: string;
  outlinedDenseText: string;
  outlinedDense: string;
  flatMultiline: string;
  flatTextArea: string;
  flatUnderlineColors: string;
  outlinedMultiline: string;
  outlinedTextArea: string;
  outlinedColors: string;
  outlinedLongLabel: string;
  maxLengthName: string;
  flatTextSecureEntry: boolean;
  outlineTextSecureEntry: boolean;
  iconsColor: IconsColor;
};

export function inputReducer<T extends keyof State>(
  state: State,
  action: ReducerAction<T>
) {
  switch (action.type) {
    case action.type:
      state[action.type] = action.payload;
      return { ...state };
    default:
      return { ...state };
  }
}

export const isWeb = Platform.OS === 'web';

export const animatedFABExampleData = [
  {
    id: '1',
    sender: 'Hermann, Pfannel & Schumm',
    header:
      'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
    message:
      'Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.\n\nMauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',
    initials: 'H',
    date: '29.1.2021',
    read: false,
    favorite: false,
    bgColor: '#ff0173',
  },
  {
    id: '2',
    sender: 'Ziemann, Lockman and Kuvalis',
    header:
      'Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue.',
    message:
      'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.',
    initials: 'J',
    date: '5.9.2020',
    read: false,
    favorite: false,
    bgColor: '#b287a9',
  },
  {
    id: '3',
    sender: 'Daniel, Kuhn and Wolf',
    header:
      'Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum.',
    message:
      'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.\n\nCurabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.',
    initials: 'Y',
    date: '13.6.2020',
    read: true,
    favorite: false,
    bgColor: '#c1bde9',
  },
  {
    id: '4',
    sender: 'Crona, Lind and Stoltenberg',
    header:
      'Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla.',
    message:
      'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
    initials: 'W',
    date: '20.5.2020',
    read: false,
    favorite: false,
    bgColor: '#932a24',
  },
  {
    id: '5',
    sender: 'Bashirian-Hudson',
    header:
      'Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst.',
    message:
      'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    initials: 'V',
    date: '21.9.2020',
    read: true,
    favorite: false,
    bgColor: '#eda5b7',
  },
  {
    id: '6',
    sender: 'Schmitt-Jacobs',
    header:
      'Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo.',
    message:
      'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.',
    initials: 'M',
    date: '2.6.2020',
    read: true,
    favorite: true,
    bgColor: '#18aaba',
  },
  {
    id: '7',
    sender: 'Graham-Champlin',
    header:
      'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue.',
    message:
      'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.',
    initials: 'T',
    date: '17.10.2020',
    read: false,
    favorite: true,
    bgColor: '#cc5e54',
  },
  {
    id: '8',
    sender: 'Schoen, Carroll and Herzog',
    header:
      'Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.',
    message:
      'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.',
    initials: 'F',
    date: '31.10.2020',
    read: false,
    favorite: false,
    bgColor: '#28db04',
  },
  {
    id: '9',
    sender: 'Pouros-Fay',
    header:
      'Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.',
    message:
      'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
    initials: 'Z',
    date: '6.1.2021',
    read: true,
    favorite: true,
    bgColor: '#b6f3fb',
  },
  {
    id: '10',
    sender: 'McKenzie, Ruecker and Bernhard',
    header: 'Nunc purus. Phasellus in felis.',
    message:
      'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.',
    initials: 'F',
    date: '23.2.2021',
    read: false,
    favorite: false,
    bgColor: '#96f066',
  },
  {
    id: '11',
    sender: 'Olson Inc',
    header:
      'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.',
    message:
      'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.',
    initials: 'V',
    date: '17.10.2020',
    read: false,
    favorite: false,
    bgColor: '#f2d49d',
  },
  {
    id: '12',
    sender: 'Walsh LLC',
    header:
      'Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis.',
    message: 'Phasellus in felis. Donec semper sapien a libero. Nam dui.',
    initials: 'O',
    date: '6.1.2021',
    read: false,
    favorite: true,
    bgColor: '#f477dc',
  },
  {
    id: '13',
    sender: 'Lemke, Cremin and Kutch',
    header:
      'Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus.',
    message:
      'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.',
    initials: 'D',
    date: '10.12.2020',
    read: false,
    favorite: false,
    bgColor: '#b2880e',
  },
  {
    id: '14',
    sender: 'Ruecker Group',
    header:
      'Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.',
    message:
      'In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.',
    initials: 'F',
    date: '21.8.2020',
    read: true,
    favorite: false,
    bgColor: '#64983a',
  },
  {
    id: '15',
    sender: 'Kovacek, Lockman and Kautzer',
    header:
      'Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    message:
      'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.',
    initials: 'L',
    date: '5.3.2020',
    read: true,
    favorite: false,
    bgColor: '#c7486b',
  },
  {
    id: '16',
    sender: 'Jaskolski-Cummerata',
    header:
      'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.',
    message:
      'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.',
    initials: 'C',
    date: '21.4.2020',
    read: false,
    favorite: false,
    bgColor: '#2f89a1',
  },
  {
    id: '17',
    sender: 'Wunsch-Walker',
    header: 'Donec vitae nisi.',
    message:
      'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.\n\nIn hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.',
    initials: 'A',
    date: '15.4.2020',
    read: false,
    favorite: true,
    bgColor: '#033cbf',
  },
  {
    id: '18',
    sender: 'Ledner Inc',
    header:
      'Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum.',
    message:
      'In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.',
    initials: 'Y',
    date: '16.5.2020',
    read: false,
    favorite: true,
    bgColor: '#166b59',
  },
  {
    id: '19',
    sender: 'Heaney-Rolfson',
    header: 'Nunc rhoncus dui vel sem.',
    message:
      'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.',
    initials: 'T',
    date: '19.1.2021',
    read: true,
    favorite: false,
    bgColor: '#da0148',
  },
  {
    id: '20',
    sender: 'Dietrich, Beier and Leannon',
    header:
      'Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc.',
    message:
      'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.',
    initials: 'Z',
    date: '21.5.2020',
    read: false,
    favorite: false,
    bgColor: '#22b33f',
  },
];
