import type { Course } from '../types'

export const courses: Course[] = [
  {
    id: 'ml-basics',
    title: '机器学习基础',
    icon: '🧠',
    tagline: '认识机器学习,理解数据、特征与训练',
    description:
      '从零开始了解机器学习是什么、数据和特征如何构成,以及模型训练、评估与泛化的核心思想。',
    gradient: 'from-sky-500 to-blue-600',
    lessons: [
      {
        id: 'what-is-ml',
        title: '什么是机器学习',
        intro: '理解机器学习到底是什么,以及它和传统编程的区别。',
        sections: [
          {
            type: 'paragraph',
            text: '机器学习(Machine Learning)是让计算机从数据中自动学习规律、做出预测或决策的一门技术。与传统"写好规则让程序照做"不同,机器学习的核心是:让程序自己从大量数据里找到规律。',
          },
          {
            type: 'paragraph',
            text: '举个例子:与其写死"如果颜色红、直径大,就是苹果"这样的规则,不如给程序成百上千张苹果和橘子的图片,让它自己总结出区分两者的特征。',
          },
          {
            type: 'keypoints',
            items: [
              '机器学习 = 数据 + 算法 + 从数据中自动学习规律',
              '它擅长解决那些难以用固定规则写清楚的问题',
            ],
          },
          {
            type: 'example',
            title: '生活中的机器学习',
            text: '邮箱自动识别垃圾邮件、购物网站推荐你可能喜欢的商品、手机相册自动把人脸归组——这些都是机器学习在背后工作。',
          },
          {
            type: 'summary',
            text: '机器学习让计算机从数据中学习,而不是依赖人工写死的规则。这是它和传统编程最本质的区别。',
          },
        ],
      },
      {
        id: 'data-features',
        title: '数据与特征',
        intro: '了解机器学习的"原料"——数据和特征。',
        sections: [
          {
            type: 'paragraph',
            text: '机器学习离不开数据。在监督学习中,每条数据通常由「特征(feature)」和「标签(label)」组成。特征是对事物的描述,标签是我们希望模型预测的答案。',
          },
          {
            type: 'example',
            title: '预测房价',
            text: '一套房子的面积、房间数、地段是特征,它的成交价格是标签。模型的目标是学会"从特征算出标签"。',
          },
          {
            type: 'list',
            items: [
              '特征(feature):描述样本的输入变量,如面积、房间数',
              '标签(label):要预测的目标,如房价',
              '训练集:用来让模型学习的数据',
              '测试集:用来检验模型好坏的数据(模型没见过这些数据)',
            ],
          },
          {
            type: 'paragraph',
            text: '把数据划分为训练集和测试集非常重要:如果只用训练集考自己,就像考试前先看了答案,分数再高也不能说明真的学会了。',
          },
          {
            type: 'summary',
            text: '特征是输入,标签是目标;用训练集学习、用测试集检验,才能客观评价模型。',
          },
        ],
      },
      {
        id: 'train-eval',
        title: '训练、评估与泛化',
        intro: '理解模型是怎么"学会"的,以及为什么有时会学过头。',
        sections: [
          {
            type: 'paragraph',
            text: '"训练"本质上是不断调整模型内部的参数,让预测结果越来越接近真实标签。调整得"好不好",由一个叫「损失函数(loss function)」的指标来衡量:损失越小,说明预测越准。',
          },
          {
            type: 'formula',
            text: '损失函数的通用思路:L = 平均( (预测值 − 真实值)² )',
          },
          {
            type: 'paragraph',
            text: '我们真正关心的是模型在没见过的新数据上的表现,这叫「泛化能力」。训练中常见两个问题:欠拟合(没学够,训练集上表现就差)和过拟合(背答案,训练集很好、新数据很差)。',
          },
          {
            type: 'list',
            items: [
              '欠拟合:模型太简单,连训练数据都没学好',
              '过拟合:模型太复杂,把训练数据的噪声也背了下来',
              '好的拟合:在训练集和新数据上表现都稳定',
            ],
          },
          {
            type: 'summary',
            text: '训练靠损失函数指导,评价靠泛化能力;要避免欠拟合和过拟合两个极端。',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'ml-basics-q1',
        question: '机器学习与"传统编程"最本质的区别是什么?',
        options: [
          '机器学习不需要任何数据',
          '机器学习让程序从数据中自动学习规律,而不是人工写死规则',
          '机器学习比传统编程运行更快',
          '机器学习不需要计算机',
        ],
        answerIndex: 1,
        explanation:
          '机器学习从数据中自动总结规律,而不是依赖程序员手写规则,这是它与传统编程的根本区别。',
      },
      {
        id: 'ml-basics-q2',
        question: '在"预测房价"的例子中,房屋面积属于什么?',
        options: ['标签', '特征', '损失函数', '模型参数'],
        answerIndex: 1,
        explanation:
          '面积是用来描述房屋的输入变量,属于特征(feature);房价才是要预测的标签。',
      },
      {
        id: 'ml-basics-q3',
        question: '为什么要把数据分成训练集和测试集?',
        options: [
          '为了少写代码',
          '为了客观检验模型在没见过的数据上的表现',
          '为了加快训练速度',
          '两者没有任何区别',
        ],
        answerIndex: 1,
        explanation:
          '测试集是模型没见过的数据,用它才能客观检验模型的泛化能力,避免"自欺欺人"。',
      },
      {
        id: 'ml-basics-q4',
        question: '模型在训练集上表现很好,但在新数据上表现很差,这最可能是什么现象?',
        options: ['欠拟合', '过拟合', '数据太多导致的必然结果', '梯度下降'],
        answerIndex: 1,
        explanation:
          '训练集很好、新数据很差,说明模型把训练数据的噪声也记住了,这是典型的过拟合。',
      },
    ],
  },
  {
    id: 'linear-regression',
    title: '线性回归',
    icon: '📈',
    tagline: '用一条直线拟合数据,预测连续数值',
    description:
      '最经典的机器学习模型之一。理解直线 ŷ = w·x + b、均方误差,以及梯度下降如何找到最优参数。',
    gradient: 'from-blue-600 to-violet-600',
    demo: 'linear-regression',
    lessons: [
      {
        id: 'line-to-predict',
        title: '从直线到预测',
        intro: '用一条直线来拟合数据,做出连续数值的预测。',
        sections: [
          {
            type: 'paragraph',
            text: '线性回归是最简单也最经典的机器学习模型之一,用于预测连续数值,比如房价、温度、销量。它的核心思想:假设输入 x 和输出 y 之间近似成直线关系。',
          },
          {
            type: 'formula',
            text: 'ŷ = w·x + b',
          },
          {
            type: 'paragraph',
            text: '其中 ŷ 是预测值,x 是输入特征,w 是斜率(权重),b 是截距(偏置)。训练的目标,就是找到一条最"贴合"所有数据点的直线。',
          },
          {
            type: 'example',
            title: '用面积预测房价',
            text: '假设 y 是房价(万元),x 是面积(㎡)。如果模型学到 w = 0.5、b = 30,那么一套 80㎡ 的房子预测价为 ŷ = 0.5 × 80 + 30 = 70 万元。',
          },
          {
            type: 'summary',
            text: '线性回归用直线 ŷ = w·x + b 拟合数据,预测连续数值;要学习的是 w 和 b。',
          },
        ],
      },
      {
        id: 'cost-function',
        title: '代价函数与最小二乘',
        intro: '怎么衡量一条直线"好"还是"坏"?',
        sections: [
          {
            type: 'paragraph',
            text: '对每个数据点,真实值和预测值之间的差距叫「残差」。把所有点的残差平方再求平均,就得到了「均方误差(MSE)」,它是线性回归最常用的代价函数。',
          },
          {
            type: 'formula',
            text: 'MSE = (1/n) · Σ (yᵢ − ŷᵢ)²',
          },
          {
            type: 'paragraph',
            text: '平方的作用有两个:一是让正负残差不会相互抵消,二是对大误差惩罚更重。MSE 越小,说明直线拟合得越好。',
          },
          {
            type: 'example',
            title: '手算一个 MSE',
            text: '若两个数据点真实值为 y = [2, 4],直线预测为 ŷ = [1, 3],则 MSE = ((2−1)² + (4−3)²) / 2 = 1。',
          },
          {
            type: 'summary',
            text: '均方误差 MSE 用"平方平均"的方式衡量预测误差,是线性回归的目标函数;训练就是让 MSE 尽量小。',
          },
        ],
      },
      {
        id: 'gradient-descent',
        title: '梯度下降',
        intro: '让计算机自动找到最优的 w 和 b。',
        sections: [
          {
            type: 'paragraph',
            text: '想找到让 MSE 最小的 w 和 b,可以想象你站在一个"误差山谷"里,目标是走到谷底。梯度下降的做法是:每次朝误差下降最快的方向迈一小步,反复迭代,最终到达谷底附近。',
          },
          {
            type: 'formula',
            text: 'w ← w − α · ∂MSE/∂w  (对 b 同理)',
          },
          {
            type: 'paragraph',
            text: '其中 α 叫「学习率(learning rate)」,控制每一步迈多大。太大容易越过谷底来回震荡,太小则收敛很慢。实践中通常同时更新所有参数。',
          },
          {
            type: 'example',
            title: '一次参数更新',
            text: '假设当前 w = 1,学习率 α = 0.1,这一点的梯度为 4(误差随 w 增大而上升),那么更新后 w ← 1 − 0.1 × 4 = 0.6。如此反复,直到梯度接近 0,说明已到达谷底附近。',
          },
          {
            type: 'note',
            text: '在"互动演示"里你可以亲手拖动 w 和 b 的滑块,观察直线、残差和 MSE 如何一起变化,直观感受梯度下降想要达到的目标。',
          },
          {
            type: 'summary',
            text: '梯度下降沿误差下降方向迭代更新参数,学习率决定步长;目标是让代价函数最小。',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'linear-q1',
        question: '线性回归通常用于预测什么类型的目标?',
        options: ['分类标签', '连续数值', '图片类别', '文本情感'],
        answerIndex: 1,
        explanation: '线性回归用于预测连续数值,如房价、温度;分类标签通常用分类模型。',
      },
      {
        id: 'linear-q2',
        question: '在 ŷ = w·x + b 中,当 w 固定时,增大 b 会使直线怎样?',
        options: ['变得更陡', '上下平移', '左右平移', '旋转 90 度'],
        answerIndex: 1,
        explanation: 'b 是截距,决定直线与 y 轴的交点位置,增大 b 会让整条直线向上平移。',
      },
      {
        id: 'linear-q3',
        question: '均方误差 MSE 中对残差"平方"的作用是什么?',
        options: [
          '让计算更快',
          '让正负残差不抵消,并对大误差惩罚更重',
          '保证结果是整数',
          '没有任何作用',
        ],
        answerIndex: 1,
        explanation: '平方让正负残差都变成正值,同时放大对大误差的惩罚。',
      },
      {
        id: 'linear-q4',
        question: '梯度下降中,学习率过大最可能导致什么?',
        options: [
          '收敛变慢',
          '参数在最优解附近震荡甚至发散',
          '模型变得更简单',
          'MSE 恒为 0',
        ],
        answerIndex: 1,
        explanation: '学习率过大时,每次迈步太大,可能反复越过最低点甚至越走越远(发散)。',
      },
    ],
  },
  {
    id: 'logistic-regression',
    title: '逻辑回归',
    icon: '🎯',
    tagline: '从概率出发,解决二分类问题',
    description:
      '名字带"回归",实则是分类模型。理解 Sigmoid 函数如何把线性输出变成 0~1 的概率,以及决策边界。',
    gradient: 'from-violet-500 to-purple-600',
    lessons: [
      {
        id: 'regression-to-classify',
        title: '从回归到分类',
        intro: '名字里有"回归",但逻辑回归其实是做分类的经典模型。',
        sections: [
          {
            type: 'paragraph',
            text: '逻辑回归虽然名字带"回归",实际上是一个分类模型,尤其擅长二分类问题:答案是"是/否"、"垃圾邮件/正常邮件"、"患病/健康"。',
          },
          {
            type: 'paragraph',
            text: '线性回归输出的是任意实数,而分类需要输出"属于某一类的概率"(0 到 1 之间)。逻辑回归的做法,就是把线性回归的输出"压缩"到 0~1 区间。',
          },
          {
            type: 'formula',
            text: 'z = w·x + b  →  p = σ(z),其中 p ∈ (0, 1)',
          },
          {
            type: 'example',
            title: '判断邮件是否是垃圾邮件',
            text: '模型根据邮件的特征(如包含"中奖"的次数)输出一个 0~1 的概率,概率越接近 1 越可能是垃圾邮件;超过阈值(如 0.5)就判定为垃圾邮件。',
          },
          {
            type: 'summary',
            text: '逻辑回归是经典的二分类模型,把线性输出转换成 0~1 之间的概率。',
          },
        ],
      },
      {
        id: 'sigmoid',
        title: 'Sigmoid 函数',
        intro: '认识那个把任意实数"压"进 0~1 的 S 形函数。',
        sections: [
          {
            type: 'formula',
            text: 'σ(z) = 1 / (1 + e⁻ᶻ)',
          },
          {
            type: 'paragraph',
            text: '这里 z = w·x + b 是线性回归的输出。Sigmoid 函数把任意大的正数压向 1,把任意负的数压向 0,输出正好可以理解为概率。它的图像是一条平滑的 S 形曲线。',
          },
          {
            type: 'list',
            items: [
              'z 很大时,σ(z) 接近 1',
              'z = 0 时,σ(z) = 0.5',
              'z 很小时,σ(z) 接近 0',
            ],
          },
          {
            type: 'example',
            title: '手算 Sigmoid',
            text: 'z = 0 时,σ(0) = 1/(1+e⁰) = 0.5;z = 2 时,σ(2) ≈ 1/(1+0.135) ≈ 0.88。z 越大,概率越接近 1。',
          },
          {
            type: 'summary',
            text: 'Sigmoid 函数 σ(z) = 1/(1+e⁻ᶻ) 把线性输出 z 映射到 (0, 1),作为分类概率。',
          },
        ],
      },
      {
        id: 'decision-boundary',
        title: '决策边界与损失函数',
        intro: '模型如何画出一条分界线,以及它靠什么"好坏"标准来训练。',
        sections: [
          {
            type: 'paragraph',
            text: '当 σ(w·x+b) = 0.5 时,即 w·x+b = 0,这条线就是「决策边界」:边界一侧预测为 1,另一侧预测为 0。',
          },
          {
            type: 'paragraph',
            text: '逻辑回归不用 MSE 作为损失函数,而是用「交叉熵」,它能更好地衡量"预测概率和真实标签"的差距。预测错得越离谱,损失越大。',
          },
          {
            type: 'formula',
            text: '交叉熵:−( y·log(ŷ) + (1−y)·log(1−ŷ) )',
          },
          {
            type: 'example',
            title: '决策边界',
            text: '若模型学到 z = 2x − 3,则当 x > 1.5 时 z > 0,预测概率 > 0.5,判定为正类;x < 1.5 时判定为负类。',
          },
          {
            type: 'summary',
            text: '决策边界是 w·x+b = 0;逻辑回归用交叉熵作为损失函数来训练。',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'logistic-q1',
        question: '逻辑回归主要用于解决什么问题?',
        options: ['回归预测连续值', '二分类问题', '聚类', '降维'],
        answerIndex: 1,
        explanation: '尽管名字带"回归",逻辑回归是经典的二分类模型。',
      },
      {
        id: 'logistic-q2',
        question: 'Sigmoid 函数 σ(z) 的输出范围是?',
        options: ['(-∞, +∞)', '[0, 1]', '(0, 1)', '[-1, 1]'],
        answerIndex: 2,
        explanation: 'σ(z) 把任意实数映射到开区间 (0, 1),两端永远达不到。',
      },
      {
        id: 'logistic-q3',
        question: '当 σ(z) = 0.5 时,z 的值为?',
        options: ['1', '0', '0.5', '-1'],
        answerIndex: 1,
        explanation: 'σ(0) = 1/(1+e⁰) = 1/2 = 0.5,所以 z = 0。',
      },
      {
        id: 'logistic-q4',
        question: '逻辑回归的决策边界由下列哪个条件决定?',
        options: ['σ(z) = 1', 'w·x + b = 0', 'MSE 最小', '学习率 α = 0'],
        answerIndex: 1,
        explanation: '当 w·x+b = 0 时 σ = 0.5,正好处于两类的分界,这就是决策边界。',
      },
    ],
  },
  {
    id: 'decision-tree',
    title: '决策树',
    icon: '🌳',
    tagline: '用一连串问题,把数据一步步分开',
    description:
      '像猜谜游戏一样通过不断提问做决策。理解树的结构、信息增益,以及为什么要剪枝。',
    gradient: 'from-indigo-500 to-blue-600',
    lessons: [
      {
        id: 'tree-decision',
        title: '用一连串问题做决策',
        intro: '像"猜谜游戏"一样,通过不断提问把样本一步步分开。',
        sections: [
          {
            type: 'paragraph',
            text: '决策树是一种像流程图一样的模型:从根节点开始,根据某个特征的取值不断提问("面积是否大于 100㎡?"),沿着分支走到叶子节点,叶子给出最终预测。',
          },
          {
            type: 'paragraph',
            text: '它的最大优点是直观、可解释——你可以直接看到模型为什么做出某个判断,而不用像"黑箱"一样去猜。',
          },
          {
            type: 'example',
            title: '决定周末是否出门',
            text: '根节点问"是否下雨?"→ 是:不出门;否:再问"是否有朋友约?"→ 是:出门;否:不出门。这就是一棵小决策树。',
          },
          {
            type: 'summary',
            text: '决策树通过不断按特征"提问"来分类,结构清晰、易于理解。',
          },
        ],
      },
      {
        id: 'split-feature',
        title: '如何选择分裂特征',
        intro: '每个节点应该先问哪个问题?信息增益给出答案。',
        sections: [
          {
            type: 'paragraph',
            text: '建树的关键是决定"先按哪个特征分"。直觉上,我们希望每次分裂都让数据"变得更纯"——同一组里的样本标签越一致越好。',
          },
          {
            type: 'paragraph',
            text: '「信息增益」衡量一次分裂让数据"纯了多少":把原本混乱的集合,按某特征分成几组后,混乱程度(熵)下降得越多,这个特征就越适合当前节点。类似的指标还有「基尼系数」。',
          },
          {
            type: 'list',
            items: [
              '熵:衡量一组数据的混乱程度',
              '信息增益:分裂前熵 − 分裂后加权熵',
              '增益越大,说明这个特征越能"分得开"',
            ],
          },
          {
            type: 'summary',
            text: '决策树用信息增益(或基尼系数)选择最优分裂特征,目标是让每次分裂后数据更"纯"。',
          },
        ],
      },
      {
        id: 'pruning',
        title: '过拟合与剪枝',
        intro: '树越长越复杂,也越容易"背答案",需要修剪。',
        sections: [
          {
            type: 'paragraph',
            text: '如果不加限制,决策树会一直分裂下去,直到每个叶子节点只有极少样本。这样树在训练集上几乎完美,却因为记住了噪声而过拟合。',
          },
          {
            type: 'paragraph',
            text: '解决办法是「剪枝」:限制树的深度、要求叶子至少包含若干样本,或事后把收益不大的分支剪掉。适度限制复杂度,能显著提升泛化能力。',
          },
          {
            type: 'summary',
            text: '决策树容易过拟合,通过限制深度、剪枝等方法控制复杂度,提升泛化。',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'tree-q1',
        question: '决策树最突出的优点是什么?',
        options: [
          '训练速度一定最快',
          '模型直观、可解释',
          '永远不会过拟合',
          '不需要数据',
        ],
        answerIndex: 1,
        explanation: '决策树像流程图一样可读,能清楚解释每次判断的依据。',
      },
      {
        id: 'tree-q2',
        question: '决策树的"叶子节点"通常表示什么?',
        options: ['一个特征', '一次提问', '一个最终预测结果', '一个学习率'],
        answerIndex: 2,
        explanation: '数据沿分支一路走到叶子节点,叶子给出最终的预测或分类结果。',
      },
      {
        id: 'tree-q3',
        question: '选择分裂特征时,信息增益越大说明什么?',
        options: [
          '数据越混乱',
          '这次分裂让数据变得越"纯"',
          '树越高',
          '样本越多',
        ],
        answerIndex: 1,
        explanation: '信息增益越大,说明按该特征分裂后混乱程度下降越多,分组越"纯"。',
      },
      {
        id: 'tree-q4',
        question: '为防止决策树过拟合,通常采用什么方法?',
        options: [
          '增大学习率',
          '剪枝或限制树的深度',
          '删除所有叶子节点',
          '把特征随机打乱',
        ],
        answerIndex: 1,
        explanation: '通过剪枝、限制深度等方式控制树的复杂度,可以缓解过拟合。',
      },
    ],
  },
  {
    id: 'kmeans',
    title: 'K-means 聚类',
    icon: '🫧',
    tagline: '没有标签,也能自动分组',
    description:
      '进入无监督学习。理解聚类思想与 K-means 的"分配—更新中心"迭代过程,以及如何选择 K 值。',
    gradient: 'from-purple-500 to-fuchsia-600',
    demo: 'kmeans',
    lessons: [
      {
        id: 'unsupervised',
        title: '无监督与聚类',
        intro: '没有标签的时候,如何让机器自己发现数据的结构?',
        sections: [
          {
            type: 'paragraph',
            text: '前面学的大多是有标签的监督学习。而聚类属于无监督学习:数据没有标签,我们要做的是把相似的数据自动分到一起,让"组内相似、组间不同"。',
          },
          {
            type: 'example',
            title: '客户分群',
            text: '电商平台根据用户的消费金额、购买频率等特征,把用户自动分成几类(如"高价值用户""偶尔购买"),从而制定不同营销策略——这就是聚类。',
          },
          {
            type: 'summary',
            text: '聚类是无监督学习,把没有标签的数据按相似度自动分组。',
          },
        ],
      },
      {
        id: 'kmeans-steps',
        title: 'K-means 算法步骤',
        intro: '最流行的聚类算法,靠"反复移动中心"来分群。',
        sections: [
          {
            type: 'paragraph',
            text: 'K-means 需要先指定想分成 K 类。它的核心是一个不断迭代的过程:分配 → 更新中心 → 再分配……',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              '随机选择 K 个点作为初始聚类中心',
              '把每个样本分配到离它最近的中心',
              '重新计算每一类的中心(取该类所有点的平均值)',
              '重复第 2、3 步,直到中心几乎不再移动',
            ],
          },
          {
            type: 'formula',
            text: '中心更新:cⱼ = 第 j 类所有点的平均值',
          },
          {
            type: 'paragraph',
            text: '因为每轮都会让中心更"居中",损失(每个点到所属中心的距离平方和)会不断下降,最终收敛。',
          },
          {
            type: 'summary',
            text: 'K-means 通过"分配样本 → 更新中心"的迭代,把数据分成 K 个簇,直到中心稳定。',
          },
        ],
      },
      {
        id: 'choose-k',
        title: '选择 K 值与局限',
        intro: 'K 选几?K-means 有哪些弱点?',
        sections: [
          {
            type: 'paragraph',
            text: 'K 值通常需要结合业务和观察来选择。「肘部法则(Elbow Method)」是一种常用启发式:画出不同 K 对应的损失曲线,选择曲线由陡转缓的"拐点"。',
          },
          {
            type: 'paragraph',
            text: 'K-means 也有局限:对初始中心敏感(可能陷入局部最优)、对异常值敏感、擅长发现"球状"簇而不擅长形状复杂的簇。',
          },
          {
            type: 'summary',
            text: '用肘部法则等启发式选择 K;K-means 对初始中心和异常值敏感,适合球状数据。',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'kmeans-q1',
        question: '聚类属于哪一类学习?',
        options: ['监督学习', '无监督学习', '强化学习', '迁移学习'],
        answerIndex: 1,
        explanation: '聚类数据没有标签,属于无监督学习。',
      },
      {
        id: 'kmeans-q2',
        question: 'K-means 中,更新聚类中心的规则是?',
        options: [
          '随机移动',
          '取该类所有样本的平均值',
          '取离最远点最近的位置',
          '固定不变',
        ],
        answerIndex: 1,
        explanation: '每轮把中心移动到该类所有样本的平均位置,使中心更"居中"。',
      },
      {
        id: 'kmeans-q3',
        question: '肘部法则用于选择什么?',
        options: [
          '学习率',
          'K 值(簇的个数)',
          '初始中心的位置',
          '迭代次数',
        ],
        answerIndex: 1,
        explanation: '肘部法则通过观察损失随 K 变化的"拐点"来选择簇的个数。',
      },
      {
        id: 'kmeans-q4',
        question: 'K-means 的一个典型局限是?',
        options: [
          '只能用于分类',
          '对初始中心敏感,可能陷入局部最优',
          '必须要有标签',
          '只能分 2 类',
        ],
        answerIndex: 1,
        explanation: 'K-means 对初始中心敏感,不同初始化可能得到不同结果,可能陷入局部最优。',
      },
    ],
  },
  {
    id: 'neural-network',
    title: '神经网络入门',
    icon: '🕸️',
    tagline: '从神经元到深度学习',
    description:
      '理解神经网络的基本单元、多层结构与前向传播,以及反向传播如何让网络学会任务。',
    gradient: 'from-cyan-500 to-indigo-600',
    lessons: [
      {
        id: 'neuron',
        title: '神经元与激活函数',
        intro: '从单个"神经元"开始,理解神经网络的基本单元。',
        sections: [
          {
            type: 'paragraph',
            text: '神经网络受到生物神经元的启发。一个最简单的「神经元」做的事和逻辑回归很像:先对输入做加权求和,再通过一个激活函数输出。',
          },
          {
            type: 'formula',
            text: '输出 = 激活函数( Σ wᵢ·xᵢ + b )',
          },
          {
            type: 'paragraph',
            text: '激活函数(如前面见过的 Sigmoid,或更常用的 ReLU)给网络带来非线性,这是它能表达复杂关系的关键。没有激活函数,再多层也只是"线性"的堆叠。',
          },
          {
            type: 'example',
            title: 'ReLU',
            text: 'ReLU(x) = max(0, x):x 为负时输出 0,为正时原样输出,是当前深度网络最常用的激活函数之一。',
          },
          {
            type: 'summary',
            text: '神经元 = 加权求和 + 激活函数;激活函数引入非线性。',
          },
        ],
      },
      {
        id: 'multilayer',
        title: '多层网络与前向传播',
        intro: '把很多神经元连起来,层层传递信息。',
        sections: [
          {
            type: 'paragraph',
            text: '把神经元一层层叠起来,就形成了「多层神经网络」。数据从输入层进入,经过若干「隐藏层」逐层计算,最终从输出层给出结果,这个过程叫「前向传播」。',
          },
          {
            type: 'paragraph',
            text: '隐藏层越多、越宽,网络表达复杂规律的能力越强——这也是"深度学习"中"深"字的由来。',
          },
          {
            type: 'list',
            items: [
              '输入层:接收特征',
              '隐藏层:提取越来越抽象的特征',
              '输出层:给出最终预测',
            ],
          },
          {
            type: 'summary',
            text: '多层神经网络通过前向传播,从输入层经隐藏层逐步计算到输出层。',
          },
        ],
      },
      {
        id: 'backprop',
        title: '反向传播与训练',
        intro: '神经网络靠什么"学会"?答案是反向传播。',
        sections: [
          {
            type: 'paragraph',
            text: '神经网络训练的目标仍是让损失最小。由于参数非常多,我们需要高效地计算"每个参数对损失的影响"。「反向传播」就是这样一种算法:从输出层把误差逐层往回传,算出每个权重的梯度。',
          },
          {
            type: 'formula',
            text: '反向传播:误差从输出层逐层传回,用于更新每个 w',
          },
          {
            type: 'paragraph',
            text: '得到梯度后,再用梯度下降更新参数。现代深度学习框架会自动完成反向传播,我们只需定义网络结构和损失函数。',
          },
          {
            type: 'summary',
            text: '反向传播把误差逐层传回并计算梯度,配合梯度下降完成训练。',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'nn-q1',
        question: '神经网络中,激活函数最重要的作用是?',
        options: [
          '加快计算',
          '引入非线性,让网络能表达复杂关系',
          '减少参数数量',
          '消除噪声',
        ],
        answerIndex: 1,
        explanation: '激活函数引入非线性,这是多层网络能表达复杂函数的关键。',
      },
      {
        id: 'nn-q2',
        question: 'ReLU(x) = max(0, x),当 x = -3 时输出为?',
        options: ['3', '-3', '0', '1'],
        answerIndex: 2,
        explanation: 'max(0, -3) = 0,ReLU 把负数置为 0。',
      },
      {
        id: 'nn-q3',
        question: '数据从输入层经隐藏层到输出层的计算过程叫?',
        options: ['反向传播', '前向传播', '梯度下降', '剪枝'],
        answerIndex: 1,
        explanation: '数据从输入到输出逐层计算的过程称为前向传播。',
      },
      {
        id: 'nn-q4',
        question: '反向传播的作用是?',
        options: [
          '把数据打乱',
          '从输出层逐层传回误差,计算每个参数的梯度',
          '选择隐藏层数量',
          '把输出映射到 0~1',
        ],
        answerIndex: 1,
        explanation: '反向传播把误差从输出层逐层传回,高效计算每个权重的梯度。',
      },
    ],
  },
]

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id)
}
