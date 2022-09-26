interface IEmoji {
  title: string;
  key?: string;
  path: string;
}

interface IEmojiExpand extends IEmoji {
  width: string;
  height: string;
}

const emojiConf = [
  {
    type: 'smiley',
    width: '34px',
    height: '34px',
    icon: '/api/emoji/v1-f64e767243a36ab94b9c6ccee825dd04.png',
    list: [
      { title: '赞同', path: '/api/emoji/v1-66d0143689386907c2b2e58a9d39ec83.png' },
      { title: '蹲', path: '/api/emoji/v1-01cdf27419344ec73febffe3fe3a9f81.png' },
      { title: '爱', path: '/api/emoji/v1-6032128becd6f95726c144e67fe8470f.png' },
      { title: '害羞', path: '/api/emoji/v1-c08d7c3852d7487f9534ee8294bc6fc6.png' },
      { title: '好奇', path: '/api/emoji/v1-4ff15dc12ddb90ba1b34167f8e9a0eb7.png' },
      { title: '思考', path: '/api/emoji/v1-74aa2823a8560c07f454842348da7e8e.png' },
      { title: '酷', path: '/api/emoji/v1-1d279b54570c7190259124c342766bc2.png' },
      { title: '大笑', path: '/api/emoji/v1-dbf55cde02b55137787aaa4066bde6a0.png' },
      { title: '微笑', path: '/api/emoji/v1-f64e767243a36ab94b9c6ccee825dd04.png' },
      { title: '捂脸', path: '/api/emoji/v1-d9e7876c56b344971ac65f3f5d9b5394.png' },
      { title: '捂嘴', path: '/api/emoji/v1-d6a6ed6fc423ff40348194aebf0d4aa2.png' },
      { title: '飙泪笑', path: '/api/emoji/v1-3ac28c4d2dab1c7a520bc3aaf809eee6.png' },
      { title: '耶', path: '/api/emoji/v1-e6c464bf4f8ef2dea91e68a7fb2e8a31.png' },
      { title: '可怜', path: '/api/emoji/v1-cbb378debd1d748fec32826b0a002647.png' },
      { title: '惊喜', path: '/api/emoji/v1-743d1a60d49b7345a848ac90c5bdadbb.png' },
      { title: '流泪', path: '/api/emoji/v1-9567c083914b7aab9dcce71c5c93a88a.png' },
      { title: '大哭', path: '/api/emoji/v1-6f03562f46816b11b5aa931c26143892.png' },
      { title: '生气', path: '/api/emoji/v1-bbc3823c5f35224e69f2d580a6f2e1ec.png' },
      { title: '惊讶', path: '/api/emoji/v1-0fde51c1b082625f092030e2446b18cb.png' },
      { title: '调皮', path: '/api/emoji/v1-3dbeffed613a7d8532648379b3211839.png' },
      { title: '衰', path: '/api/emoji/v1-7ffcadd4905c5d9829234304b077316c.png' },
      { title: '发呆', path: '/api/emoji/v1-d0d44ec454cf3aa92e0b65bc7e74eb59.png' },
      { title: '机智', path: '/api/emoji/v1-3a1b96b2de76004a07b321ff93853385.png' },
      { title: '嘘', path: '/api/emoji/v1-c98d0e3450ce7e03e7a125f8b41354ee.png' },
      { title: '尴尬', path: '/api/emoji/v1-1d691bd3704c5c27033e2d42450b8628.png' },
      { title: '小情绪', path: '/api/emoji/v1-8b93af76b55cf7c01deb00f6b9200700.png' },
      { title: '为难', path: '/api/emoji/v1-b5872ee2aff519e6055153ab4ff791fd.png' },
      { title: '吃瓜', path: '/api/emoji/v1-93f794006a549245be64eec6b72af194.png' },
      { title: '语塞', path: '/api/emoji/v1-81fb5e3e727e960a9c4c3f1f25862fa3.png' },
      { title: '看看你', path: '/api/emoji/v1-232888e6a5b58ec4633e2d59ab890a66.png' },
      { title: '撇嘴', path: '/api/emoji/v1-dcc33348ca589cf57425d0a683bab7d9.png' },
      { title: '魔性笑', path: '/api/emoji/v1-f95ab8c2f9020ba19d5a792dc51a91d1.png' },
      { title: '潜水', path: '/api/emoji/v1-e964b6630a60b38d17b12bcc98f72362.png' },
      { title: '口罩', path: '/api/emoji/v1-a89745f1729609730b9723dec0f9b518.png' },
      { title: '开心', path: '/api/emoji/v1-161675c26ecafe978af4da7e36cd1434.png' },
      { title: '滑稽', path: '/api/emoji/v1-0806adf6d46f8384e7dfb51d91225a77.png' },
      { title: '笑哭', path: '/api/emoji/v1-be0332485c2bf2a1b131e06e32d3aa9c.png' },
      { title: '白眼', path: '/api/emoji/v1-0bd1f8ff10ebf26bdf4e1a7f475cfb8b.png' },
      { title: '红心', path: '/api/emoji/v1-034c4e7a9bea39781a503d444108c124.png' },
      { title: '柠檬', path: '/api/emoji/v1-a598c626348d18307c85414549b312eb.png' },
      { title: '拜托', path: '/api/emoji/v1-29826d99e25f9247a3f83199491b6657.png' },
      { title: '握手', path: '/api/emoji/v1-d7406f800ad027be3d15fbd4956eeadc.png' },
      { title: '赞', path: '/api/emoji/v1-30b3e8ca872f5545f863fdf07815bb1c.png' },
      { title: '发火', path: '/api/emoji/v1-74661046e22d667a91e7466dfbbacf8b.png' },
      { title: '不抬杠', path: '/api/emoji/v1-07e982ae952a0dcc380262fb2a8b94ba.png' },
      { title: '种草', path: '/api/emoji/v1-6c1639d91f8683068b3f4ae4d6041b60.png' },
      { title: '抱抱', path: '/api/emoji/v1-9fedd2d115c1383bcfe4843fb5de6442.png' },
      { title: 'doge', path: '/api/emoji/v1-17274c1bbcb1354a9d2ac54a84961181.png' },
    ],
  },
  {
    type: 'juejin',
    width: '34px',
    height: '34px',
    icon: '/api/emoji/v2-f64e767243a36ab94b9c6ccee825dd04.png',
    list: [
      { key: 'juejin/微笑', title: '微笑', path: '/api/emoji/v2-f64e767243a36ab94b9c6ccee825dd04.png' },
      { key: 'juejin/呲牙', title: '呲牙', path: '/api/emoji/v2-44dee6edea51920f7c49c8db968cdf5b.png' },
      { key: 'juejin/色', title: '色', path: '/api/emoji/v2-0af71a6d9991ed75ff23cdec41cce980.png' },
      { key: 'juejin/发呆', title: '发呆', path: '/api/emoji/v2-d0d44ec454cf3aa92e0b65bc7e74eb59.png' },
      { key: 'juejin/可怜', title: '可怜', path: '/api/emoji/v2-cbb378debd1d748fec32826b0a002647.png' },
      { key: 'juejin/流泪', title: '流泪', path: '/api/emoji/v2-9567c083914b7aab9dcce71c5c93a88a.png' },
      { key: 'juejin/害羞', title: '害羞', path: '/api/emoji/v2-c08d7c3852d7487f9534ee8294bc6fc6.png' },
      { key: 'juejin/闭嘴', title: '闭嘴', path: '/api/emoji/v2-694da021aa2a539b00c8cdf27c996e0a.png' },
      { key: 'juejin/睡', title: '睡', path: '/api/emoji/v2-e008f6ff0aac026ec8af2716f6ff1a83.png' },
      { key: 'juejin/吃瓜群众', title: '吃瓜群众', path: '/api/emoji/v2-3337b385911e7c8b556eeb8c568f5249.png' },
      { key: 'juejin/尴尬', title: '尴尬', path: '/api/emoji/v2-1d691bd3704c5c27033e2d42450b8628.png' },
      { key: 'juejin/发怒', title: '发怒', path: '/api/emoji/v2-a0280de1e51e2c3972a0a6e17dfe2888.png' },
      { key: 'juejin/调皮', title: '调皮', path: '/api/emoji/v2-3dbeffed613a7d8532648379b3211839.png' },
      { key: 'juejin/撇嘴', title: '撇嘴', path: '/api/emoji/v2-dcc33348ca589cf57425d0a683bab7d9.png' },
      { key: 'juejin/思考', title: '思考', path: '/api/emoji/v2-74aa2823a8560c07f454842348da7e8e.png' },
      { key: 'juejin/不失礼貌的微笑', title: '不失礼貌的微笑', path: '/api/emoji/v2-e72a25dc27092fb54507821c178738fb.png' },
      { key: 'juejin/奸笑', title: '奸笑', path: '/api/emoji/v2-d5467695e6ec31bead3b120a622e4535.png' },
      { key: 'juejin/抓狂', title: '抓狂', path: '/api/emoji/v2-71de923fde888057e6e50ec62fd7ede1.png' },
      { key: 'juejin/吐', title: '吐', path: '/api/emoji/v2-ee25670da2cd900f8ea86b3e7ac80866.png' },
      { key: 'juejin/偷笑', title: '偷笑', path: '/api/emoji/v2-6c42a71f135a6c9cf87019918e272318.png' },
      { key: 'juejin/愉快', title: '愉快', path: '/api/emoji/v2-c417a90b75c2ec0e061ddfce9a50932b.png' },
      { key: 'juejin/白眼', title: '白眼', path: '/api/emoji/v2-0bd1f8ff10ebf26bdf4e1a7f475cfb8b.png' },
      { key: 'juejin/傲慢', title: '傲慢', path: '/api/emoji/v2-18efbf59a3c2d8987f72bddb342677f5.png' },
      { key: 'juejin/困', title: '困', path: '/api/emoji/v2-396e672b0d7b91e1f91f938d67edfdae.png' },
      { key: 'juejin/灵光一现', title: '灵光一现', path: '/api/emoji/v2-f87a0ea2a0f099afbec9294475a08dbf.png' },
      { key: 'juejin/流汗', title: '流汗', path: '/api/emoji/v2-832fd4366cbee6ceb44837110cc06a83.png' },
      { key: 'juejin/憨笑', title: '憨笑', path: '/api/emoji/v2-19182cbe695c91c29a9e05d1326e0ba1.png' },
      { key: 'juejin/捂脸', title: '捂脸', path: '/api/emoji/v2-d9e7876c56b344971ac65f3f5d9b5394.png' },
      { key: 'juejin/奋斗', title: '奋斗', path: '/api/emoji/v2-f0468a950c9c8cc2eace90b565cc1da0.png' },
      { key: 'juejin/咒骂', title: '咒骂', path: '/api/emoji/v2-0b4be4792be7c1f7d95569829e6a452b.png' },
      { key: 'juejin/疑问', title: '疑问', path: '/api/emoji/v2-292ac41b0d672fd5d3cba021b8a4d7f0.png' },
      { key: 'juejin/嘘', title: '嘘', path: '/api/emoji/v2-c98d0e3450ce7e03e7a125f8b41354ee.png' },
      { key: 'juejin/晕', title: '晕', path: '/api/emoji/v2-9c8ba141e50003c5e7b035983baf3170.png' },
      { key: 'juejin/衰', title: '衰', path: '/api/emoji/v2-7ffcadd4905c5d9829234304b077316c.png' },
      { key: 'juejin/骷髅', title: '骷髅', path: '/api/emoji/v2-08e9cda2a44f711e35c6db227b934b46.png' },
      { key: 'juejin/敲打', title: '敲打', path: '/api/emoji/v2-6be0ba1c946ea65fe72c05e6f75eefe7.png' },
      { key: 'juejin/再见', title: '再见', path: '/api/emoji/v2-1a58a02bca02b89157693cd29c877c61.png' },
      { key: 'juejin/擦汗', title: '擦汗', path: '/api/emoji/v2-89fa0c6f65d8e2057c08621c5a521a8d.png' },
      { key: 'juejin/抠鼻', title: '抠鼻', path: '/api/emoji/v2-ca50af9d0fea7f3f8aa3260f54cb9a30.png' },
      { key: 'juejin/泣不成声', title: '泣不成声', path: '/api/emoji/v2-02d0b5e78fcb63c5121742e0ca7bd513.png' },
      { key: 'juejin/坏笑', title: '坏笑', path: '/api/emoji/v2-8d2da3f4eef6a1f2883809b01bcef425.png' },
      { key: 'juejin/左哼哼', title: '左哼哼', path: '/api/emoji/v2-d59d1dcef694cb9dc2d2f94797a7ecfc.png' },
      { key: 'juejin/右哼哼', title: '右哼哼', path: '/api/emoji/v2-dff50cb94a55f1928c820b55b1aa2b31.png' },
      { key: 'juejin/打哈欠', title: '打哈欠', path: '/api/emoji/v2-1f4673ece100f568d4f115c074e63dba.png' },
      { key: 'juejin/鄙视', title: '鄙视', path: '/api/emoji/v2-b40daa52a3e57661e39001a9b6bed647.png' },
      { key: 'juejin/委屈', title: '委屈', path: '/api/emoji/v2-1e2e2b3d99a6f26d4a6b778090758090.png' },
      { key: 'juejin/快哭了', title: '快哭了', path: '/api/emoji/v2-15d83205ec1404fa051ea1108561ebca.png' },
      { key: 'juejin/摸头', title: '摸头', path: '/api/emoji/v2-9786ef6c4fab565233db7a2d16e000bf.png' },
      { key: 'juejin/阴险', title: '阴险', path: '/api/emoji/v2-99c310664f673a837de30bcab8173a56.png' },
      { key: 'juejin/亲亲', title: '亲亲', path: '/api/emoji/v2-c63948d3a0d3f225488aa5dd6441dabc.png' },
      { key: 'juejin/机智', title: '机智', path: '/api/emoji/v2-3a1b96b2de76004a07b321ff93853385.png' },
      { key: 'juejin/得意', title: '得意', path: '/api/emoji/v2-30d05dc08e26ebb8532270f1a3520899.png' },
      { key: 'juejin/大金牙', title: '大金牙', path: '/api/emoji/v2-8da0b7b5287267fb57218fe2334b7048.png' },
      { key: 'juejin/拥抱', title: '拥抱', path: '/api/emoji/v2-8a2a7722e1eb1d28d1d6f87a7a9cd87a.png' },
      { key: 'juejin/大笑', title: '大笑', path: '/api/emoji/v2-dbf55cde02b55137787aaa4066bde6a0.png' },
      { key: 'juejin/送心', title: '送心', path: '/api/emoji/v2-4147789a394e7dece0c142ca2f3ed05a.png' },
      { key: 'juejin/震惊', title: '震惊', path: '/api/emoji/v2-49caeceb57f44af7bc6df92ade4694d2.png' },
      { key: 'juejin/酷拽', title: '酷拽', path: '/api/emoji/v2-1c50c514d396da9d759ac4ae7e8c4df0.png' },
      { key: 'juejin/尬笑', title: '尬笑', path: '/api/emoji/v2-89762f1a92a8fd778c4c5a5a5062928d.png' },
      { key: 'juejin/大哭', title: '大哭', path: '/api/emoji/v2-6f03562f46816b11b5aa931c26143892.png' },
      { key: 'juejin/哭笑', title: '哭笑', path: '/api/emoji/v2-b5087e9fec7e60301db7a69df2cfd93c.png' },
      { key: 'juejin/做鬼脸', title: '做鬼脸', path: '/api/emoji/v2-64992c3fe2da6a1e38e19ae8e66c0bcc.png' },
      { key: 'juejin/红脸', title: '红脸', path: '/api/emoji/v2-25f43ad7fb48577a040ae3d6ce114c44.png' },
      { key: 'juejin/鼓掌', title: '鼓掌', path: '/api/emoji/v2-d6008049501d71450aa72959d4cecf22.png' },
      { key: 'juejin/恐惧', title: '恐惧', path: '/api/emoji/v2-d03691fd839d4a651d3096e2d6e81dd6.png' },
      { key: 'juejin/斜眼', title: '斜眼', path: '/api/emoji/v2-eff0b725d57d9d7a7d568d3ca992eb96.png' },
      { key: 'juejin/嘿哈', title: '嘿哈', path: '/api/emoji/v2-1f7b344ded73ef51df05eab54541dcb6.png' },
      { key: 'juejin/惊讶', title: '惊讶', path: '/api/emoji/v2-0fde51c1b082625f092030e2446b18cb.png' },
      { key: 'juejin/绝望的凝视', title: '绝望的凝视', path: '/api/emoji/v2-9940bc4c48692ccc12a0d01dabff8979.png' },
      { key: 'juejin/囧', title: '囧', path: '/api/emoji/v2-118ef50f653d23a152c336a1bc656704.png' },
      { key: 'juejin/皱眉', title: '皱眉', path: '/api/emoji/v2-3dc0bd626c52aef907440299ebaf84ab.png' },
      { key: 'juejin/耶', title: '耶', path: '/api/emoji/v2-e6c464bf4f8ef2dea91e68a7fb2e8a31.png' },
      { key: 'juejin/石化', title: '石化', path: '/api/emoji/v2-843a450ef5cd0c8a089aa19a16109fed.png' },
      { key: 'juejin/我想静静', title: '我想静静', path: '/api/emoji/v2-ce3207ec0bdeebf95c996af1473f3ff7.png' },
      { key: 'juejin/吐血', title: '吐血', path: '/api/emoji/v2-a42d07b74ecafe5e123041b7b2fbd200.png' },
      { key: 'juejin/互粉', title: '互粉', path: '/api/emoji/v2-b8872729ec192d912a6c1298bea7d693.png' },
      { key: 'juejin/互相关注', title: '互相关注', path: '/api/emoji/v2-12732ff853d548d25dd1b580511c1750.png' },
      { key: 'juejin/加好友', title: '加好友', path: '/api/emoji/v2-1dd4f7e35bf868f410108b28ef6b8f53.png' },
      { key: 'juejin/强', title: '强', path: '/api/emoji/v2-aaae51696b235caa213364f19d60212d.png' },
      { key: 'juejin/钱', title: '钱', path: '/api/emoji/v2-1122799de557da2860ce16b9278bc04a.png' },
      { key: 'juejin/飞吻', title: '飞吻', path: '/api/emoji/v2-4bc342e323504c30475bada859531aed.png' },
      { key: 'juejin/打脸', title: '打脸', path: '/api/emoji/v2-3cb325e8dd55b2342bd702ff9fd55527.png' },
      { key: 'juejin/惊恐', title: '惊恐', path: '/api/emoji/v2-ffee1a667aa8e0937fc6c6e485e02163.png' },
      { key: 'juejin/悠闲', title: '悠闲', path: '/api/emoji/v2-f59b4373668477c566d24110bd63010e.png' },
      { key: 'juejin/泪奔', title: '泪奔', path: '/api/emoji/v2-102f2a59ac1c323a18bf19fb8047c32b.png' },
      { key: 'juejin/舔屏', title: '舔屏', path: '/api/emoji/v2-246294a0c66072b261205ed11ef7865a.png' },
      { key: 'juejin/紫薇别走', title: '紫薇别走', path: '/api/emoji/v2-182023254fa09dd6f17639843c1bdcf5.png' },
      { key: 'juejin/听歌', title: '听歌', path: '/api/emoji/v2-773422e7021f0802ed4dba35d8f74ad2.png' },
      { key: 'juejin/难过', title: '难过', path: '/api/emoji/v2-53c30f513f3ce8875229b793819bd9ba.png' },
      { key: 'juejin/生病', title: '生病', path: '/api/emoji/v2-a6a32a951103b49f561814c8bdbc7daa.png' },
      { key: 'juejin/绿帽子', title: '绿帽子', path: '/api/emoji/v2-c9351ae700af6496007f2a9e0f631405.png' },
      { key: 'juejin/如花', title: '如花', path: '/api/emoji/v2-852c1d6284cf071cbb9b3d85ba7c64e1.png' },
      { key: 'juejin/惊喜', title: '惊喜', path: '/api/emoji/v2-743d1a60d49b7345a848ac90c5bdadbb.png' },
      { key: 'juejin/吐彩虹', title: '吐彩虹', path: '/api/emoji/v2-2060527b16838a129610cbcf493f89e8.png' },
      { key: 'juejin/吐舌', title: '吐舌', path: '/api/emoji/v2-9923de7a15a8050fb001d93a132d5040.png' },
      { key: 'juejin/无辜呆', title: '无辜呆', path: '/api/emoji/v2-2b5d642642d59f92078044b1a5c01b2d.png' },
      { key: 'juejin/看', title: '看', path: '/api/emoji/v2-0ec425bc62d0c46010ac5f3359554e09.png' },
      { key: 'juejin/白眼的狗', title: '白眼的狗', path: '/api/emoji/v2-5e5bad56ea426153a0abb1ae58f6f3fe.png' },
      { key: 'juejin/黑脸', title: '黑脸', path: '/api/emoji/v2-a507f1d5f9754ea5743f2e32dc385875.png' },
      { key: 'juejin/猪头', title: '猪头', path: '/api/emoji/v2-053c4354e13fd399ed05457308782e2f.png' },
      { key: 'juejin/熊吉', title: '熊吉', path: '/api/emoji/v2-f0838fabb5b10058f0c136e9b4f770c6.png' },
      { key: 'juejin/不看', title: '不看', path: '/api/emoji/v2-2575301e4c02e044d3c10eac0373ca29.png' },
    ]
  },
  {
    type: 'doge',
    width: '56px',
    height: '56px',
    icon: '/api/emoji/v1-3d801995129fffe80ffe1da114f017a4.png',
    list: [
      { title: 'OK', path: '/api/emoji/v1-e2d6579a83aba07c4180c21c5fe9893d.png' },
      { title: '困', path: '/api/emoji/v1-396e672b0d7b91e1f91f938d67edfdae.png' },
      { title: '疼', path: '/api/emoji/v1-291ceedb7a7f7b9d10a0b24d113d53e6.png' },
      { title: '不错', path: '/api/emoji/v1-2f6d6f8a9fada00cfc08b7d47e5947f4.png' },
      { title: '举手', path: '/api/emoji/v1-d94fef8c0e5d5dc985c65ca0625e8c7d.png' },
      { title: '优雅', path: '/api/emoji/v1-c818293ddbc36e2b525e72bf49ffe179.png' },
      { title: '再见', path: '/api/emoji/v1-1a58a02bca02b89157693cd29c877c61.png' },
      { title: '凝重', path: '/api/emoji/v1-3d801995129fffe80ffe1da114f017a4.png' },
      { title: '吐血', path: '/api/emoji/v1-a42d07b74ecafe5e123041b7b2fbd200.png' },
      { title: '听歌', path: '/api/emoji/v1-773422e7021f0802ed4dba35d8f74ad2.png' },
      { title: '委屈', path: '/api/emoji/v1-1e2e2b3d99a6f26d4a6b778090758090.png' },
      { title: '很好', path: '/api/emoji/v1-19e9ee8b438caba83b52eb9e5c06c278.png' },
      { title: '抱拳', path: '/api/emoji/v1-441e995b689e57c045333517ace02179.png' },
      { title: '拍照', path: '/api/emoji/v1-3071f25f00b5061bf426a45f010dd5f4.png' },
      { title: '拒绝', path: '/api/emoji/v1-a582b8c5965ec744494c5a7eb3e9869a.png' },
      { title: '无辜', path: '/api/emoji/v1-c63086610b9410d677abb5b190c1df5a.png' },
      { title: '看片', path: '/api/emoji/v1-02a14845b015c4801a04369571478cc9.png' },
      { title: '舒服', path: '/api/emoji/v1-59d56cebd80af3a7a027f0caa8b63302.png' },
      { title: '花花', path: '/api/emoji/v1-4c08ea5dd5c006dfcaf81f95f2c05a6d.png' },
      { title: '认真', path: '/api/emoji/v1-d2343e40e0bb6bfa1801537071d1b1ac.png' },
      { title: '难受', path: '/api/emoji/v1-e58b680187cfe3cd8994bded8538e22a.png' },
      { title: '喝奶茶', path: '/api/emoji/v1-c33884c7b9fb07b7528975bb7d6b4f89.png' },
      { title: '不好意思', path: '/api/emoji/v1-d5ce6fd9c09f039ea275bd3ed3b1732e.png' },
      { title: '暗中观察', path: '/api/emoji/v1-ea4dec6d88f823da3c7cd048597cc126.png' },
    ],
  }
];

const emojiMap = new Map<string, IEmojiExpand>();
const emojiKeys: string[] = [];

emojiConf
  .reduce((acc, item) => {
    return [...acc, ...item.list.map(em => ({ ...em, width: item.width, height: item.height }))];
  }, [])
  .map((em) => {
    emojiMap.set(`[${em.key ?? em.title}]`, em);
    emojiKeys.push(em.key ?? em.title);
  });

const regExp = new RegExp(`(\\[(${emojiKeys.join('|')})\\])`, 'g');

const parseEmoji = (text: string): string => {
  return text.replace(regExp, (item: string) => {
    const emoji: IEmojiExpand = emojiMap.get(item);
    return `<img src='${emoji.path}' alt='${emoji.title}' class='textarea-emoji' style='width:${emoji.width};height:${emoji.height};padding:4px' />`;
  });
};

const formatEmoji = (emoji: IEmoji): string => {
  return `[${emoji.key ?? emoji.title}]`;
};

export {
  emojiConf,
  parseEmoji,
  formatEmoji,
};
