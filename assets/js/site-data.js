/*
  以后你主要只需要改这个文件。

  1) 把 assets/images/ 里的示例图片换成自己的照片；
  2) 修改下面 name / intro；
  3) 每增加一个合集，就复制 collections 里的一个 {...}。

  photos 可以写成：
    "assets/images/your-album/photo01.jpg"
  或者带说明：
    { src: "assets/images/your-album/photo01.jpg", caption: "Old Orchard Beach, 2026" }
*/

window.SITE = {
  siteTitle: "小船的后院",
  name: "YOUR NAME",
  intro: "在这里写一句很短的自我介绍。",

  collections: [
    {
      id: "seaside",
      title: "海边",
      meta: "2026 · Maine",
      cover: "assets/images/cover.jpeg",
      coverPosition: "50% 50%",
      intro: "这里写这个摄影合集的背景：在哪里拍、为什么开始拍、你当时在关注什么。",
      reflection: "这里可以写更私人的感想。不需要像艺术家 statement，可以只是拍完这一卷之后你真正记住的东西。",
      photos: [
        { src: "assets/images/cover.jpeg", caption: "示例照片 · 请替换成你的照片" }
      ]
    },
    {
      id: "streets",
      title: "街上",
      meta: "2026 · Walks",
      cover: "assets/images/cover.jpeg",
      coverPosition: "50% 34%",
      intro: "每个合集都可以有自己的简介。首页只显示代表照片，点进来以后再看完整系列。",
      reflection: "你也可以把这一段删掉，只留下几句话，让照片本身说话。",
      photos: [
        { src: "assets/images/cover.jpeg", caption: "示例照片 · 请替换成你的照片" }
      ]
    },
    {
      id: "after-dark",
      title: "夜里",
      meta: "2026 · After dark",
      cover: "assets/images/cover.jpeg",
      coverPosition: "50% 68%",
      intro: "这里可以放一个夜景、人物、双重曝光或任何你想长期积累的系列。",
      reflection: "合集不必按照地点分类，也可以按照一种光线、一卷胶片或某段时间来分。",
      photos: [
        { src: "assets/images/cover.jpeg", caption: "示例照片 · 请替换成你的照片" }
      ]
    }
  ]
};
