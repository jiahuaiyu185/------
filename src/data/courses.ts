import type { Course } from '../types'

export const courses: Course[] = [
  {
    id: 'python-data',
    title: 'Python 数据处理入门',
    icon: '🐍',
    tagline: '用 Python 清洗数据、画图,为机器学习准备原料',
    description:
      '机器学习从数据开始。掌握用纯 Python 清洗数据、用 NumPy 与 Pandas 处理表格、用 Matplotlib 画图,并理解特征 X 与标签 y。',
    gradient: 'from-teal-500 to-emerald-600',
    lessons: [
      {
        id: 'clean-data',
        title: '用 Python 清洗数据',
        intro: '看懂"缺失值 → 清洗 → 算统计量 → 拆出特征与标签"的完整流程。',
        sections: [
          {
            type: 'objectives',
            items: [
              '能识别数据中的缺失值(None)',
              '会写循环过滤掉包含缺失值的记录',
              '会计算平均值、最高分等统计量',
              '理解特征 X 与标签 y 分别是什么',
            ],
          },
          {
            type: 'paragraph',
            text: '机器学习的第一步,是准备干净的数据。真实数据常常有缺失、有错误,所以要先"清洗"。即使只用 Python 自带的列表和字典,也能完成这项工作:把每一条数据当成一个字典,遍历、过滤、统计。',
          },
          {
            type: 'example',
            title: '一份带缺失值的数据',
            text: '下面这份"学习时间 → 成绩"的数据里,有两条不完整:小刚没记录学习时间,小王没记录成绩。清洗的目标就是去掉这些不完整的记录,只保留 hours 和 score 都有的数据。',
          },
          {
            type: 'code',
            caption: '示例:过滤缺失值并计算统计量',
            text: `# 学习时间(hours)与成绩(score)的原始记录
records = [
    {"hours": 1.0, "score": 52},
    {"hours": 2.0, "score": 63},
    {"hours": None, "score": 70},   # 小刚:缺学习时间
    {"hours": 3.0, "score": 76},
    {"hours": 4.0, "score": None},  # 小王:缺成绩
    {"hours": 5.0, "score": 91},
]

# 只保留 hours 和 score 都不为 None 的记录
def clean_records(records):
    cleaned = []
    for record in records:
        if record["hours"] is not None and record["score"] is not None:
            cleaned.append(record)
    return cleaned

cleaned = clean_records(records)
count = len(cleaned)

if count > 0:
    avg_hours = sum(r["hours"] for r in cleaned) / count
    avg_score = sum(r["score"] for r in cleaned) / count
    high_score = max(r["score"] for r in cleaned)

    print(f"有效记录数:{count}")
    print(f"平均学习时间:{avg_hours}")
    print(f"平均成绩:{avg_score}")
    print(f"最高成绩:{high_score}")`,
          },
          {
            type: 'output',
            text: `有效记录数:4
平均学习时间:2.75
平均成绩:70.5
最高成绩:91`,
          },
          {
            type: 'paragraph',
            text: '清洗之后,再按机器学习的习惯把数据拆成"特征"和"标签":特征 X 是模型看到的输入,标签 y 是希望模型预测的答案。这里 X 是学习时间,y 是成绩。',
          },
          {
            type: 'code',
            caption: '示例:拆出特征 X 与标签 y',
            text: `X = []  # 特征:学习时间
y = []  # 标签:成绩
for record in cleaned:
    X.append([record["hours"]])
    y.append(record["score"])

print("特征 X:", X)
print("标签 y:", y)`,
          },
          {
            type: 'output',
            text: `特征 X: [[1.0], [2.0], [3.0], [5.0]]
标签 y: [52, 63, 76, 91]`,
          },
          {
            type: 'commonMistakes',
            items: [
              '判断 None 时写 == None 也能运行,但更规范的写法是 is None(比较的是"是不是同一个对象")。',
              '忘记先过滤缺失值就做 sum / max,会直接报错(TypeError)。',
              '计算平均值时分母写错:应该除以"有效记录数",而不是"原始记录数"。',
            ],
          },
          {
            type: 'summary',
            text: '数据清洗就是过滤掉不完整的记录;之后把输入拆成特征 X、把要预测的答案拆成标签 y,这是监督学习最基础的一步。',
          },
        ],
      },
      {
        id: 'numpy-arrays',
        title: 'NumPy 数组与向量化',
        intro: '用数组一次完成整组数据的运算,理解广播、掩码与 shape。',
        sections: [
          {
            type: 'objectives',
            items: [
              '会用 np.array 创建数组并查看它的 shape',
              '理解"广播":对整组数据一次完成运算',
              '会用布尔掩码筛选出满足条件的数据',
              '理解 shape[0] 是样本数、shape[1] 是特征数',
            ],
          },
          {
            type: 'paragraph',
            text: 'NumPy 是 Python 数值计算的基础库,机器学习几乎处处用到它。它的核心是 ndarray(多维数组):可以对整组数据一次完成运算,这种"一次算完整个数组"的方式叫向量化,比写 for 循环更简洁、也更快。',
          },
          {
            type: 'example',
            title: '列表和数组的乘法完全不同',
            text: '[1, 2, 3] * 2 得到 [1, 2, 3, 1, 2, 3](列表被重复);而 np.array([1, 2, 3]) * 2 得到 [2, 4, 6](每个元素都乘以 2)。这是 NumPy 与普通列表最容易被忽略的区别。',
          },
          {
            type: 'code',
            caption: '示例:创建数组、广播与统计',
            text: `import numpy as np

hours = np.array([1.0, 2.0, 3.0, 5.0])
scores = np.array([52, 63, 76, 91])

print("学习时间:", hours)
print("成绩:", scores)
print("hours 的形状:", hours.shape)   # (4,) 表示 4 个元素

# 广播:对整个数组一次完成运算
minutes = hours * 60                 # 小时 → 分钟
adjusted = scores + 5                # 每人加 5 分
print("学习的分钟数:", minutes)
print("加 5 分后:", adjusted)

# 常用统计
print("平均学习时间:", hours.mean())
print("平均成绩:", scores.mean())
print("最高成绩:", scores.max())
print("最低成绩:", scores.min())`,
          },
          {
            type: 'output',
            text: `学习时间: [1. 2. 3. 5.]
成绩: [52 63 76 91]
hours 的形状: (4,)
学习的分钟数: [ 60. 120. 180. 300.]
加 5 分后: [57 68 81 96]
平均学习时间: 2.75
平均成绩: 70.5
最高成绩: 91
最低成绩: 52`,
          },
          {
            type: 'code',
            caption: '示例:布尔掩码筛选',
            text: `# 找出成绩 ≥ 70 的记录
mask = scores >= 70
print("是否满足条件:", mask)        # [False False  True  True]
print("满足条件的成绩:", scores[mask])
print("对应的学习时间:", hours[mask])

# 把特征整理成"样本数 × 特征数"的二维数组
X = np.array([[1.0], [2.0], [3.0], [5.0]])
print("X 的形状:", X.shape)          # (4, 1)
print("样本数量:", X.shape[0])       # 4
print("特征数量:", X.shape[1])       # 1`,
          },
          {
            type: 'output',
            text: `是否满足条件: [False False  True  True]
满足条件的成绩: [76 91]
对应的学习时间: [3. 5.]
X 的形状: (4, 1)
样本数量: 4
特征数量: 1`,
          },
          {
            type: 'commonMistakes',
            items: [
              '把列表当数组:列表的 * 2 是重复,数组的 * 2 是逐元素相乘,两者完全不同。',
              '搞混 shape 的含义:一维数组的 shape 是 (n,),二维的 X.shape[0] 是样本数、X.shape[1] 是特征数。',
              '用 for 循环逐个元素计算,而不是利用广播,既啰嗦又慢。',
            ],
          },
          {
            type: 'summary',
            text: 'NumPy 的数组支持广播和布尔掩码,能一次性完成整组数据的运算与筛选;X.shape 里的两个数字分别是样本数和特征数。',
          },
        ],
      },
      {
        id: 'pandas-table',
        title: 'Pandas 表格处理',
        intro: '像操作 Excel 一样处理表格:缺失值、筛选、取列。',
        sections: [
          {
            type: 'objectives',
            items: [
              '会用 DataFrame 表示一张表',
              '会用 isna() 查看缺失值、dropna() 删除',
              '会按条件筛选行、按列名取列',
              '会把数据拆成特征 X 与标签 y',
            ],
          },
          {
            type: 'paragraph',
            text: 'Pandas 提供了 DataFrame(数据表),让处理数据像操作 Excel 一样直观:按列名取列、按条件筛行、一键处理缺失值。它和 NumPy 配合,是数据预处理最常用的工具。',
          },
          {
            type: 'code',
            caption: '示例:创建表格并处理缺失值',
            text: `import pandas as pd

data = {
    "name": ["小明", "小红", "小刚", "小李", "小王", "小张"],
    "hours": [1.0, 2.0, None, 3.0, 4.0, 5.0],
    "score": [52, 63, 70, 76, None, 91],
}
df = pd.DataFrame(data)
print("表格形状:", df.shape)        # (6, 3):6 行 3 列
print("每列的数据类型:")
print(df.dtypes)

print("每列的缺失值数量:")
print(df.isna().sum())

# 删除任何一列有缺失值的整行
cleaned = df.dropna()
print("清理后的有效记录数:", len(cleaned))`,
          },
          {
            type: 'output',
            text: `表格形状: (6, 3)
每列的数据类型:
name     object
hours    float64
score    float64
dtype: object
每列的缺失值数量:
name     0
hours    1
score    1
dtype: int64
清理后的有效记录数: 4`,
          },
          {
            type: 'code',
            caption: '示例:筛选行、取列并拆出 X / y',
            text: `# 按条件筛选:只保留学习 ≥ 2 小时的学生
selected = cleaned[cleaned["hours"] >= 2]
print(selected[["name", "hours", "score"]])

print("平均学习时间:", cleaned["hours"].mean())
print("最高成绩:", cleaned["score"].max())

# 特征 X 用双括号取(保持二维),标签 y 用单括号取(一维)
X = cleaned[["hours"]]
y = cleaned["score"]
print("特征 X 的形状:", X.shape)   # (4, 1)`,
          },
          {
            type: 'output',
            text: `   name  hours  score
1   小红    2.0     63
3   小李    3.0     76
5   小张    5.0     91
平均学习时间: 2.75
最高成绩: 91
特征 X 的形状: (4, 1)`,
          },
          {
            type: 'commonMistakes',
            items: [
              '取列时混用单双括号:df["hours"] 得到一维的 Series,df[["hours"]] 才是二维 DataFrame。特征 X 需要二维形状,要用双括号。',
              'dropna() 会删除"任何一列"有缺失的整行;只想针对某一列时,应写成 df.dropna(subset=["score"])。',
              '忘记清洗缺失值就做统计,虽然 Pandas 的 mean() 会自动跳过 NaN,但结果可能不是预期的,先 dropna 更稳妥。',
            ],
          },
          {
            type: 'summary',
            text: 'Pandas 用 DataFrame 表示表格,dropna 处理缺失值、条件筛选处理行、列名取列处理列;特征 X 用双括号取成二维,标签 y 用单括号取成一维。',
          },
        ],
      },
      {
        id: 'matplotlib-correlation',
        title: 'Matplotlib 画图与相关性',
        intro: '用散点图一眼看出变量关系,再用相关系数把它量化。',
        sections: [
          {
            type: 'objectives',
            items: [
              '会用 scatter 画出散点图',
              '会给图加上标题、坐标轴标签和网格',
              '理解相关系数接近 1、0、-1 分别代表什么',
              '会用 .corr() 计算相关系数',
            ],
          },
          {
            type: 'paragraph',
            text: '画图能让我们一眼看出"特征和标签之间有没有关系"。散点图是最直观的第一步;相关系数则把"关系的强弱"量化成一个介于 -1 和 1 之间的数。',
          },
          {
            type: 'code',
            caption: '示例:画散点图并计算相关系数',
            text: `import pandas as pd
import matplotlib.pyplot as plt

# 中文显示设置(不同系统可换用其他中文字体)
plt.rcParams["font.sans-serif"] = ["Arial Unicode MS"]
plt.rcParams["axes.unicode_minus"] = False

data = {
    "name": ["小明", "小红", "小刚", "小李", "小王", "小张", "小赵"],
    "hours": [1.0, 2.0, None, 3.0, 4.0, 5.0, 4.0],
    "score": [52, 63, 70, 76, None, 91, 60],
}
df = pd.DataFrame(data).dropna()

plt.scatter(df["hours"], df["score"])
plt.xlabel("学习时间(小时)")
plt.ylabel("成绩")
plt.title("学习时间与成绩")
plt.grid(True)
plt.show()

# 相关系数:衡量两个变量的线性相关程度
corr = df["hours"].corr(df["score"])
print("学习时间与成绩的相关系数:", corr)`,
          },
          {
            type: 'output',
            text: `学习时间与成绩的相关系数: 0.77`,
          },
          {
            type: 'paragraph',
            text: '图表说明:散点图里每个点代表一名学生,横轴是学习时间、纵轴是成绩。点大致沿一条从左下到右上的斜线分布,说明学习时间越长、成绩总体越高——这就是"正相关"。个别点(如 4 小时只考 60 分)偏离了整体趋势,所以相关系数没有到 1。',
          },
          {
            type: 'list',
            items: [
              '接近 1:强正相关,一个变大另一个通常也变大',
              '接近 0:几乎没有线性关系',
              '接近 -1:强负相关,一个变大另一个通常变小',
            ],
          },
          {
            type: 'commonMistakes',
            items: [
              '中文显示成方框:matplotlib 默认字体不支持中文,需要先设置 font.sans-serif(网页里我们用 SVG 画图,没有这个问题)。',
              '把"相关"当成"因果":相关系数高只说明两者一起变化,不代表一个"导致"另一个。',
              '相关系数接近 0 就下结论"没关系":它只说明没有线性关系,可能还存在曲线等非线性关系。',
            ],
          },
          {
            type: 'summary',
            text: '散点图能直观看出变量关系,相关系数把关系量化到 [-1, 1];接近 1 正相关、接近 -1 负相关、接近 0 没有线性关系。',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'python-q1',
        question: '数据里某条记录的 hours 是 None,正确的做法是?',
        options: [
          '直接对所有记录求和',
          '先过滤掉这条记录,再计算统计量',
          '把 None 当成 0',
          '忽略错误,继续运行',
        ],
        answerIndex: 1,
        explanation:
          '包含 None 的记录不能直接参与求和等计算,应该先过滤(或补全),再统计。',
      },
      {
        id: 'python-q2',
        question: 'np.array([1, 2, 3]) * 2 的结果是?',
        options: ['[1, 2, 3, 1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', '报错'],
        answerIndex: 1,
        explanation:
          'NumPy 数组的乘法是"广播",对每个元素分别乘以 2,得到 [2, 4, 6]。',
      },
      {
        id: 'python-q3',
        question: '想从 DataFrame 里取出一列 hours 作为二维的特征 X,应该写?',
        options: ['df["hours"]', 'df[["hours"]]', 'df.hours', 'df[hours]'],
        answerIndex: 1,
        explanation:
          '双括号 df[["hours"]] 得到二维 DataFrame;单括号得到一维 Series。特征 X 需要二维形状。',
      },
      {
        id: 'python-q4',
        question: '相关系数接近 0 表示什么?',
        options: [
          '两个变量几乎完全一样',
          '两个变量几乎没有线性关系',
          '两个变量一定互为因果',
          '数据一定有问题',
        ],
        answerIndex: 1,
        explanation:
          '相关系数接近 0 表示两者几乎没有线性关系(但可能仍有非线性关系)。',
      },
    ],
  },
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
            type: 'paragraph',
            text: '实际中不必手动猜 w 和 b。NumPy 的 polyfit 用最小二乘法,一步算出让误差平方和最小的直线。',
          },
          {
            type: 'code',
            caption: '示例:用 np.polyfit 自动拟合直线',
            text: `import numpy as np

hours = np.array([1.0, 2.0, 3.0, 5.0, 4.0])
scores = np.array([52, 63, 76, 91, 60])

# polyfit(x, y, 1):自动求出最优的 w 和 b
w, b = np.polyfit(hours, scores, 1)
print(f"自动找到的权重 w:{w:.2f}")
print(f"自动找到的截距 b:{b:.2f}")

# 用求出的直线预测新样本
new_hour = 4.0
predicted = w * new_hour + b
print(f"学习 {new_hour} 小时的预测成绩:{predicted:.2f}")`,
          },
          {
            type: 'output',
            text: `自动找到的权重 w:7.50
自动找到的截距 b:45.90
学习 4.0 小时的预测成绩:75.90`,
          },
          {
            type: 'paragraph',
            text: 'polyfit 一步就算出了最优的 w ≈ 7.5、b ≈ 45.9,省去手动调参。但要理解它到底在"优化什么",还要看下一节的代价函数。',
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
            type: 'paragraph',
            text: '再拿一组真实数据,对比两组不同的 w、b,亲手算一遍 MSE——MSE 更小的一组,直线拟合得更好。',
          },
          {
            type: 'code',
            caption: '示例:对比两组参数的手算 MSE',
            text: `import numpy as np

hours = np.array([1.0, 2.0, 3.0, 5.0])
scores = np.array([52, 63, 76, 91])

# 方案一:weight=10, bias=43
w1, b1 = 10, 43
pred1 = w1 * hours + b1
mse1 = ((scores - pred1) ** 2).mean()

# 方案二:weight=8, bias=45
w2, b2 = 8, 45
pred2 = w2 * hours + b2
mse2 = ((scores - pred2) ** 2).mean()

print(f"方案一 预测:{pred1}  MSE:{mse1}")
print(f"方案二 预测:{pred2}  MSE:{mse2}")`,
          },
          {
            type: 'output',
            text: `方案一 预测:[53. 63. 73. 93.]  MSE:3.5
方案二 预测:[53. 61. 69. 85.]  MSE:22.5`,
          },
          {
            type: 'paragraph',
            text: '方案一的 MSE 只有 3.5,远小于方案二的 22.5,说明方案一的直线更贴合数据。代价函数就是这样一台"打分器":给一组 w、b,它输出一个误差值,数值越小越好——训练的目标就是找到让 MSE 最小的那组参数。',
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
        demo: 'linear-regression',
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
      {
        id: 'polynomial-overfitting',
        title: '多项式回归与过拟合',
        intro: '直线不够用怎么办?次数越高的曲线越灵活,也越容易"背答案"。',
        demo: 'polynomial-overfitting',
        sections: [
          {
            type: 'objectives',
            items: [
              '理解多项式回归是线性回归的扩展',
              '理解"次数越高越灵活,但容易过拟合"',
              '会看训练误差和测试误差来判断是否过拟合',
            ],
          },
          {
            type: 'paragraph',
            text: '现实中的数据不一定是一条直线。多项式回归在线性回归的基础上,把特征 x 扩展成 x、x²、x³……,再用线性模型去拟合,从而能画出曲线。但"更灵活"不等于"更好":次数太高时,曲线会去迎合每一个数据点,反而失去泛化能力。',
          },
          {
            type: 'formula',
            text: '特征扩展:1 个特征 x → [x, x², x³, …](degree 次)',
          },
          {
            type: 'code',
            caption: '示例:比较不同次数的训练误差与测试误差',
            text: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

X = np.linspace(-1, 1, 15).reshape(-1, 1)
y = np.array([44, 49, 50, 58, 57, 66, 65, 72,
              78, 77, 86, 87, 94, 93, 101])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=1
)

for degree in [1, 2, 3, 5, 9]:
    poly = PolynomialFeatures(degree=degree, include_bias=False)
    X_train_poly = poly.fit_transform(X_train)
    X_test_poly = poly.transform(X_test)

    model = LinearRegression()
    model.fit(X_train_poly, y_train)

    train_mse = mean_squared_error(y_train, model.predict(X_train_poly))
    test_mse = mean_squared_error(y_test, model.predict(X_test_poly))
    print(f"次数 {degree}:训练 MSE {train_mse:.2f},测试 MSE {test_mse:.2f}")`,
          },
          {
            type: 'output',
            text: `次数 1:训练 MSE 12.80,测试 MSE 11.94
次数 2:训练 MSE  2.31,测试 MSE  3.55
次数 3:训练 MSE  0.85,测试 MSE  1.92
次数 5:训练 MSE  0.02,测试 MSE  3.71
次数 9:训练 MSE  0.00,测试 MSE 45.30`,
          },
          {
            type: 'paragraph',
            text: '图表说明:观察一个规律——次数从 1 加到 5,训练 MSE 一路下降,曲线越来越贴合训练点;但测试 MSE 在次数 3 之后开始反弹,次数 9 时训练误差几乎为 0、测试误差却爆炸。曲线"背下"了训练数据,却没学到规律,这就是过拟合。',
          },
          {
            type: 'note',
            text: '上面的数值是示意,实际结果会随数据与 random_state 变化;趋势(高次过拟合)是一致的。',
          },
          {
            type: 'commonMistakes',
            items: [
              '只看训练误差:训练误差最低的模型,往往不是测试集上最好的模型。',
              '以为次数越高越好:次数越高越灵活,但会把噪声也拟合进去,测试误差反而上升。',
              '忘记用同一个 transform 处理测试集:应该先用训练集 fit_transform、测试集只用 transform,否则会泄漏信息。',
            ],
          },
          {
            type: 'summary',
            text: '多项式回归通过扩展高次特征来拟合曲线;次数过高会过拟合(训练误差极低、测试误差反弹),要用测试误差(或交叉验证)来选择合适次数。',
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
      {
        id: 'linear-q5',
        question: '多项式回归的本质是?',
        options: [
          '用曲线替换所有数据点',
          '把特征 x 扩展成高次项(如 x²、x³)再用线性模型拟合',
          '把标签 y 也做平方',
          '把数据按大小排序后拟合',
        ],
        answerIndex: 1,
        explanation:
          '多项式回归通过 PolynomialFeatures 把 x 扩展成 x、x²、x³ 等,再用线性回归拟合,从而得到曲线。',
      },
      {
        id: 'linear-q6',
        question: '随着多项式次数越来越高,通常会出现什么现象?',
        options: [
          '训练和测试误差都持续下降',
          '训练误差持续下降,但测试误差先降后升(过拟合)',
          '训练误差持续上升',
          '测试误差恒为 0',
        ],
        answerIndex: 1,
        explanation:
          '次数越高曲线越灵活,训练误差一直降;但超过某个点后测试误差反弹,就是过拟合。',
      },
      {
        id: 'linear-q7',
        question: '判断模型是否过拟合,应该重点看什么?',
        options: [
          '只看训练误差',
          '训练误差与测试误差的差距(训练很低、测试很高)',
          '只看参数个数',
          '只看学习率',
        ],
        answerIndex: 1,
        explanation:
          '过拟合的典型特征是训练误差很低、测试误差却明显偏高,两者差距大。',
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
      {
        id: 'threshold',
        title: '混淆矩阵与阈值',
        intro:
          '模型先算出"通过概率",再按阈值切一刀分成两类;换一个阈值,精确率和召回率会此消彼长。',
        demo: 'logistic-threshold',
        sections: [
          {
            type: 'objectives',
            items: [
              '理解 predict() 与 predict_proba() 的区别',
              '理解阈值如何把概率变成类别',
              '了解调整阈值对精确率、召回率的影响',
            ],
          },
          {
            type: 'paragraph',
            text: 'predict() 看起来只吐出一个 0 或 1,其实它内部做了两步:先用 predict_proba() 算出"通过概率",再拿 0.5 作分界——概率 ≥ 0.5 判为 1,否则判为 0。',
          },
          {
            type: 'paragraph',
            text: '0.5 是默认阈值,但并不是唯一的答案。把阈值调低(比如 0.25),模型会更容易判"通过",于是找到更多真正通过的人(召回率上升),但也会把更多没通过的人误判为通过(精确率下降);调高则相反。',
          },
          {
            type: 'code',
            caption: '示例:拿到概率后,自定义阈值来划分类别',
            text: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    precision_score, recall_score, f1_score, confusion_matrix,
)

# 特征:第一列学习时间,第二列完成测试次数;标签:0 未通过,1 通过
X = np.array([
    [0.5, 0], [1.0, 0], [1.0, 1], [1.5, 0],
    [1.5, 1], [2.0, 0], [2.0, 1], [2.5, 1],
    [2.5, 2], [3.0, 1], [3.0, 2], [3.5, 1],
    [3.5, 2], [4.0, 2], [4.0, 3], [4.5, 2],
    [4.5, 3], [5.0, 3], [5.5, 3], [6.0, 4],
])
y = np.array([0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
              1, 0, 1, 1, 1, 1, 1, 1, 1, 1])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=1, stratify=y
)

model = LogisticRegression()
model.fit(X_train, y_train)

# predict() 默认按 0.5 阈值划分;这里换成 0.25
probability = model.predict_proba(X_test)[:, 1]

threshold = 0.25
pred_025 = (probability >= threshold).astype(int)

print("真实类别:", y_test)
print("预测类别(阈值 0.25):", pred_025)
print("混淆矩阵(阈值 0.25):")
print(confusion_matrix(y_test, pred_025))
print(f"精确率: {precision_score(y_test, pred_025):.2%}")
print(f"召回率: {recall_score(y_test, pred_025):.2%}")
print(f"F1: {f1_score(y_test, pred_025):.2%}")`,
          },
          {
            type: 'output',
            text: `真实类别: [1 0 0 1 1 0]
预测类别(阈值 0.25): [1 1 0 1 1 1]
混淆矩阵(阈值 0.25):
[[1 2]
 [0 3]]
精确率: 60.00%
召回率: 100.00%
F1: 75.00%`,
          },
          {
            type: 'paragraph',
            text: '如果沿用默认的 0.5 阈值,这套数据划分的精确率和召回率都是 67%;阈值降到 0.25 后,召回率冲到 100%——所有真正通过的人都被找到了,但精确率掉到 60%,把两个没通过的人也误判成了通过。',
          },
          {
            type: 'note',
            text: '以上是示意输出,具体数字随随机划分变化;重点是看懂"调阈值 → 精确率与召回率此消彼长"这个规律。',
          },
          {
            type: 'commonMistakes',
            items: [
              '以为阈值永远必须是 0.5:0.5 只是 sklearn 的默认值,业务需要时可以换。',
              '把 predict_proba 返回的概率直接当类别用:概率是 0~1 的连续值,还要按阈值切一刀才变成 0/1。',
              '只盯着一个指标看:调低阈值后精确率下降是召回率上升的必然代价,要结合业务权衡。',
            ],
          },
          {
            type: 'summary',
            text: '阈值是"概率变类别"的分界刀,默认 0.5;调低阈值会更"宽松"(召回率升、精确率降),调高则更"严格"(相反)。混淆矩阵与精确率/召回率的读法已在「模型评估与选择」课程讲过。',
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
      {
        id: 'logistic-q5',
        question: '逻辑回归的 predict() 内部默认用哪个概率阈值判定为正类?',
        options: ['0.25', '0.5', '0.75', '1.0'],
        answerIndex: 1,
        explanation: 'predict() 先算概率,再按 0.5 分界:概率 ≥ 0.5 判为 1。',
      },
      {
        id: 'logistic-q6',
        question: '把阈值从 0.5 调低到 0.25,一般会发生什么?',
        options: [
          '预测出更多正类,召回率上升、精确率下降',
          '预测出更少正类,召回率下降、精确率上升',
          '召回率和精确率都上升',
          '模型不再需要训练',
        ],
        answerIndex: 0,
        explanation:
          '阈值调低让模型更容易判"通过",于是找到更多真正通过的人(召回率升),但也误判更多(精确率降)。',
      },
      {
        id: 'logistic-q7',
        question: 'predict_proba(X)[:, 1] 返回的是什么?',
        options: [
          '每个样本预测的类别标签',
          '每个样本属于正类(通过)的概率',
          '每个样本的特征值',
          '模型的权重参数',
        ],
        answerIndex: 1,
        explanation:
          'predict_proba 返回每个样本属于各类的概率,第二列 [:, 1] 是"正类(通过)"的概率。',
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
      {
        id: 'tree-rules',
        title: '决策规则与特征重要性',
        intro: '把训练好的树"翻译"成一条条规则,再看每个特征贡献了多少。',
        sections: [
          {
            type: 'objectives',
            items: [
              '会用 export_text 把决策树输出成可读规则',
              '理解 max_depth 与过拟合的关系',
              '会读 feature_importances_ 特征重要性',
            ],
          },
          {
            type: 'paragraph',
            text: '决策树最大的优点是可解释。sklearn 的 export_text 能把训练好的树"翻译"成一条条 if-then 规则,直接看到模型是怎么做判断的。',
          },
          {
            type: 'paragraph',
            text: '把树的深度 max_depth 从 1 一路加大,训练准确率会越来越高,但测试准确率往往先升后降——这就是过拟合最直观的证据:树太深,就开始"背答案"而不是找规律。',
          },
          {
            type: 'code',
            caption: '示例:对比不同深度,并输出规则与特征重要性',
            text: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.metrics import accuracy_score

# 特征:第一列学习时间,第二列完成测试次数;标签:0 未通过,1 通过
X = np.array([
    [0.5, 0], [1.0, 0], [1.0, 1], [1.5, 0],
    [1.5, 1], [2.0, 0], [2.0, 1], [2.5, 1],
    [2.5, 2], [3.0, 1], [3.0, 2], [3.5, 1],
    [3.5, 2], [4.0, 2], [4.0, 3], [4.5, 2],
    [4.5, 3], [5.0, 3], [5.5, 3], [6.0, 4],
])
y = np.array([0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
              1, 0, 1, 1, 1, 1, 1, 1, 1, 1])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=1, stratify=y
)

# 依次试 1 / 2 / 3 层深度,对比训练与测试准确率
for depth in [1, 2, 3]:
    model = DecisionTreeClassifier(max_depth=depth, random_state=42)
    model.fit(X_train, y_train)
    train_acc = accuracy_score(y_train, model.predict(X_train))
    test_acc = accuracy_score(y_test, model.predict(X_test))
    print(f"max_depth={depth}  训练准确率 {train_acc:.2%}  测试准确率 {test_acc:.2%}")

# 把最后一棵树转成可读规则
rules = export_text(model, feature_names=['hours', 'practice'])
print("决策规则:")
print(rules)

# 每个特征对决策的贡献
print("特征重要性:", model.feature_importances_)`,
          },
          {
            type: 'output',
            text: `max_depth=1  训练准确率 70.00%  测试准确率 66.67%
max_depth=2  训练准确率 85.71%  测试准确率 83.33%
max_depth=3  训练准确率 100.00%  测试准确率 66.67%

决策规则:
|--- hours <= 2.50
|   |--- class: 0
|--- hours >  2.50
|   |--- hours <= 3.75
|   |   |--- class: 0
|   |--- hours >  3.75
|   |   |--- class: 1

特征重要性: [0.7 0.3]`,
          },
          {
            type: 'paragraph',
            text: '可以看到,深度到 3 时训练准确率已经 100%,但测试准确率反而掉回 66.67%——树在训练集上"背"得太死。特征重要性 [0.7, 0.3] 说明"学习时间"比"完成测试次数"对判断帮助更大。',
          },
          {
            type: 'note',
            text: '以上是示意输出,具体数字与规则随随机划分变化;重点关注深度、准确率、规则三者之间的关系。',
          },
          {
            type: 'commonMistakes',
            items: [
              '只看训练准确率:训练集上几乎满分往往意味着过拟合,要同时看测试集。',
              '把"特征重要性高"当成"因果关系":重要性只表示这个特征对模型的预测有用,不等于现实中的因果。',
              '以为 max_depth 越大越好:深度过大反而让测试表现变差。',
            ],
          },
          {
            type: 'summary',
            text: 'export_text 把决策树转成可读规则;扫描 max_depth 能直观看到过拟合;feature_importances_ 给出每个特征对预测的贡献大小。',
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
      {
        id: 'tree-q5',
        question: 'sklearn 中 export_text 的作用是?',
        options: [
          '把决策树转成可读的 if-then 规则',
          '导出训练数据集',
          '计算模型准确率',
          '保存模型到磁盘',
        ],
        answerIndex: 0,
        explanation: 'export_text 把训练好的决策树翻译成人类可读的分支规则。',
      },
      {
        id: 'tree-q6',
        question: '决策树的 feature_importances_ 表示什么?',
        options: [
          '每个样本的类别',
          '每个特征对预测的贡献大小',
          '树的深度',
          '训练数据的大小',
        ],
        answerIndex: 1,
        explanation:
          'feature_importances_ 给出每个特征对决策的贡献(重要性),数值越大越重要。',
      },
      {
        id: 'tree-q7',
        question: '决策树的深度 max_depth 不断增大时,通常会发生什么?',
        options: [
          '训练准确率升高,测试准确率可能先升后降',
          '训练和测试准确率都一直升高',
          '训练准确率下降',
          '对结果没有任何影响',
        ],
        answerIndex: 0,
        explanation:
          '树越深越能"记住"训练集,训练准确率一路升;但过深会导致过拟合,测试准确率反而下降。',
      },
    ],
  },
  {
    id: 'model-evaluation',
    title: '模型评估与选择',
    icon: '📊',
    tagline: '怎么判断模型好坏?用指标和交叉验证来评价与选择模型',
    description:
      '训练出模型只是第一步。用 MSE、MAE、R² 评估回归,用准确率、精确率、召回率、F1 评估分类,再用交叉验证更可靠地选择模型。',
    gradient: 'from-orange-500 to-rose-500',
    lessons: [
      {
        id: 'regression-metrics',
        title: '回归指标 MSE / MAE / R²',
        intro: '回归预测连续数值,用三个指标从不同角度衡量预测误差。',
        sections: [
          {
            type: 'objectives',
            items: [
              '区分 MSE、MAE、R² 各自衡量什么',
              '会在测试集上计算这三个指标',
              '理解 R² 越接近 1,模型解释得越好',
            ],
          },
          {
            type: 'paragraph',
            text: '回归预测的是连续数值(比如成绩、房价)。判断预测准不准,最常用三个指标:均方误差 MSE、平均绝对误差 MAE、决定系数 R²。它们从不同角度衡量"预测值离真实值有多远"。',
          },
          {
            type: 'formula',
            text: 'MSE = (1/n)·Σ(y − ŷ)²     MAE = (1/n)·Σ|y − ŷ|     R² = 1 − Σ(y − ŷ)² / Σ(y − ȳ)²',
          },
          {
            type: 'paragraph',
            text: 'MSE 把误差平方后再平均,对"特别大的误差"惩罚最重;MAE 是误差绝对值的平均,和原始数据同单位、更好理解;R² 表示模型解释了目标多少比例的变化——1 表示完美,0 表示和"直接预测平均值"一样差。',
          },
          {
            type: 'code',
            caption: '示例:训练线性回归并在测试集上评估',
            text: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# 特征 X:学习时间(小时)
X = np.array([[1.0], [1.5], [2.0], [2.5], [3.0],
              [3.5], [4.0], [4.5], [5.0], [5.5]])
# 标签 y:成绩
y = np.array([50, 55, 61, 65, 72, 74, 80, 85, 88, 94])

# 拆成训练集(70%)和测试集(30%),random_state 让结果可复现
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=1
)

model = LinearRegression()
model.fit(X_train, y_train)              # 训练
pred = model.predict(X_test)             # 在测试集上预测

print("测试集真实成绩:", y_test)
print("测试集预测成绩:", np.round(pred, 2))

mse = mean_squared_error(y_test, pred)
mae = mean_absolute_error(y_test, pred)
r2 = r2_score(y_test, pred)
print(f"MSE:{mse:.2f}")
print(f"MAE:{mae:.2f}")
print(f"R²:{r2:.2f}")`,
          },
          {
            type: 'output',
            text: `测试集真实成绩: [80 50 74]
测试集预测成绩: [82.34 48.12 75.89]
MSE:5.62
MAE:2.20
R²:0.95`,
          },
          {
            type: 'note',
            text: '上面是一份示意输出,具体数字会随 random_state 和划分比例变化;关注的重点是三个指标各自的含义。',
          },
          {
            type: 'commonMistakes',
            items: [
              '在训练集上评估,而不是测试集:训练集上误差总是偏小,不能反映泛化能力。',
              '把 MSE 和 MAE 搞混:MSE 对误差平方、大误差惩罚更重;MAE 与目标同单位、更直观。',
              '以为 R² 越大越好且永不超 1:R² 最大是 1;如果模型很差,甚至可能是负数(比"直接预测平均值"还差)。',
            ],
          },
          {
            type: 'summary',
            text: 'MSE 平方放大误差、MAE 更直观、R² 衡量解释比例;三者都要在测试集上计算,才能客观评价回归模型。',
          },
        ],
      },
      {
        id: 'classification-metrics',
        title: '分类指标 准确率 / 精确率 / 召回率 / F1',
        intro: '数据不平衡时,准确率会骗人;用精确率、召回率、F1 看得更清楚。',
        sections: [
          {
            type: 'objectives',
            items: [
              '理解准确率、精确率、召回率、F1 的含义',
              '会读混淆矩阵',
              '知道在什么场景下该重点看精确率还是召回率',
            ],
          },
          {
            type: 'paragraph',
            text: '分类任务(比如判断学生"是否通过")的评价指标更丰富。如果数据不平衡——例如绝大多数人都不通过——只看准确率会骗人:模型哪怕把所有样本都预测成"不通过",准确率也很高。',
          },
          {
            type: 'paragraph',
            text: '精确率回答"被预测为通过的人里,有多少真的通过";召回率回答"真正通过的人里,模型找到了多少";F1 是两者的调和平均,用来综合评价。',
          },
          {
            type: 'formula',
            text: '精确率 P = TP / (TP + FP)    召回率 R = TP / (TP + FN)    F1 = 2·P·R / (P + R)',
          },
          {
            type: 'code',
            caption: '示例:计算分类指标与混淆矩阵',
            text: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, confusion_matrix,
    precision_score, recall_score, f1_score,
)

# 特征:第一列学习时间,第二列完成测试次数;标签:0 未通过,1 通过
X = np.array([
    [0.5, 0], [1.0, 0], [1.0, 1], [1.5, 0],
    [1.5, 1], [2.0, 0], [2.0, 1], [2.5, 1],
    [2.5, 2], [3.0, 1], [3.0, 2], [3.5, 1],
    [3.5, 2], [4.0, 2], [4.0, 3], [4.5, 2],
    [4.5, 3], [5.0, 3], [5.5, 3], [6.0, 4],
])
y = np.array([0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
              1, 0, 1, 1, 1, 1, 1, 1, 1, 1])

# stratify=y 保证训练/测试里"通过/不通过"比例一致
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=1, stratify=y
)

model = LogisticRegression()
model.fit(X_train, y_train)
pred = model.predict(X_test)

print("真实类别:", y_test)
print("预测类别:", pred)
print("准确率:", accuracy_score(y_test, pred))
print("精确率:", precision_score(y_test, pred))
print("召回率:", recall_score(y_test, pred))
print("F1:", f1_score(y_test, pred))
print("混淆矩阵:")
print(confusion_matrix(y_test, pred))`,
          },
          {
            type: 'output',
            text: `真实类别: [1 0 0 1 1 0]
预测类别: [1 0 0 0 1 1]
准确率: 0.67
精确率: 0.67
召回率: 0.67
F1: 0.67
混淆矩阵:
[[2 1]
 [1 2]]`,
          },
          {
            type: 'paragraph',
            text: '混淆矩阵按"行=真实类别、列=预测类别"排列。上面 2×2 的矩阵里:左上角是"真实不通过且预测不通过"(2 人),右上角是"真实不通过却预测通过"(1 人,误报),左下角是"真实通过却预测不通过"(1 人,漏报),右下角是"真实通过且预测通过"(2 人)。',
          },
          {
            type: 'note',
            text: '上面是一份示意输出,实际数字会随随机划分变化;重点看指标怎么读、矩阵怎么理解。',
          },
          {
            type: 'commonMistakes',
            items: [
              '混淆矩阵读反:行是真实、列是预测(不同库可能反过来),读错方向会得到颠倒的精确率和召回率。',
              '数据不平衡时只看准确率:哪怕全预测成多数类,准确率也可能很高。',
              '混淆精确率和召回率:精确率看"预测为正里有多少对",召回率看"真正为正里找到多少"。',
            ],
          },
          {
            type: 'summary',
            text: '准确率在数据不平衡时会失真;精确率关注"预测的准确性"、召回率关注"有没有漏掉",F1 是两者的平衡;混淆矩阵是理解它们的关键。',
          },
        ],
      },
      {
        id: 'cross-validation',
        title: '交叉验证与模型选择',
        intro: '把"一次划分"变成"K 次轮流验证取平均",估计更稳定。',
        sections: [
          {
            type: 'objectives',
            items: [
              '理解 K 折交叉验证的做法',
              '理解它为什么比单次划分更可靠',
              '会用交叉验证来选择模型或超参数',
            ],
          },
          {
            type: 'paragraph',
            text: '只把数据随机分成一次训练/测试,结果会受"这次怎么切"的影响,换一次切法分数可能差很多。K 折交叉验证把数据切成 K 份,轮流拿 1 份当验证集、其余当训练集,最后对 K 次分数取平均,结果更稳定、更可信。',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              '把数据(随机打乱后)分成 K 份',
              '轮流用其中 1 份做验证集,其余 K-1 份做训练集',
              '训练并打分,共得到 K 个分数',
              '对 K 个分数取平均,作为对模型表现的估计',
            ],
          },
          {
            type: 'code',
            caption: '示例:用交叉验证选择多项式次数',
            text: `import numpy as np
from sklearn.model_selection import KFold, cross_val_score
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline

X = np.linspace(-1, 1, 15).reshape(-1, 1)
y = np.array([44, 49, 50, 58, 57, 66, 65, 72,
              78, 77, 86, 87, 94, 93, 101])

# 5 折:随机打乱后分成 5 份,轮流验证
kfold = KFold(n_splits=5, shuffle=True, random_state=1)

for degree in [1, 2, 3, 5, 9]:
    model = make_pipeline(
        PolynomialFeatures(degree=degree, include_bias=False),
        LinearRegression(),
    )
    # sklearn 对 MSE 返回负值,取负号后才是均方误差
    neg_scores = cross_val_score(
        model, X, y, cv=kfold, scoring="neg_mean_squared_error"
    )
    mse_scores = -neg_scores
    print(f"次数 {degree}:每折 MSE {np.round(mse_scores, 2)},"
          f"平均 {mse_scores.mean():.2f}")`,
          },
          {
            type: 'output',
            text: `次数 1:每折 MSE [15.23  9.87 12.41 11.05 13.72],平均 12.46
次数 2:每折 MSE [ 3.11  4.52  2.98  4.03  3.77],平均  3.68
次数 3:每折 MSE [ 1.24  1.87  1.55  1.66  1.42],平均  1.55
次数 5:每折 MSE [ 1.05  1.38  1.21  1.29  1.11],平均  1.21
次数 9:每折 MSE [18.54  5.62  9.31  7.28  6.14],平均  9.38`,
          },
          {
            type: 'paragraph',
            text: '可以看到,次数从 1 升到 5,平均 MSE 一路下降;但次数到 9 时误差反而大幅反弹——这就是过拟合:模型记住了训练数据的噪声,泛化变差。交叉验证帮我们用更可靠的方式选中"平均误差最小"的那个次数。',
          },
          {
            type: 'note',
            text: '上面的数值是示意,实际结果会随数据与 random_state 变化;趋势(高次过拟合)是一致的。',
          },
          {
            type: 'commonMistakes',
            items: [
              '忘记打乱:用 KFold 做验证时最好 shuffle=True;分类任务则用 StratifiedKFold 保持每类比例。',
              '正负号搞混:sklearn 的 scoring="neg_mean_squared_error" 返回负值,要取负号才是真正的 MSE。',
              '用交叉验证"选完模型"后,又在同一个数据上报告成绩,导致信息泄漏、分数虚高。',
            ],
          },
          {
            type: 'summary',
            text: '交叉验证把"一次划分"变成"K 次轮流验证取平均",估计更稳定;它是选择模型和超参数(如多项式次数)的可靠方法。',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'eval-q1',
        question: '下列哪个指标对"特别大的误差"惩罚最重?',
        options: ['MAE', 'MSE', 'R²', '准确率'],
        answerIndex: 1,
        explanation:
          'MSE 把误差平方,大误差被放大,所以对大误差惩罚最重;MAE 只取绝对值。',
      },
      {
        id: 'eval-q2',
        question: 'R² 越接近下面哪个值,说明回归模型越好?',
        options: ['-1', '0', '1', '0.5'],
        answerIndex: 2,
        explanation:
          'R² 最大为 1,越接近 1 说明模型解释的目标变化比例越高、拟合越好。',
      },
      {
        id: 'eval-q3',
        question: '在"预测学生是否通过"的任务中,精确率衡量的是?',
        options: [
          '所有学生里真正通过的比例',
          '被预测为通过的人里,真正通过的比例',
          '真正通过的人里,被模型找到的比例',
          '预测为不通过的人里,真的不通过的比例',
        ],
        answerIndex: 1,
        explanation:
          '精确率 = 被预测为通过的人里真正通过的比例;召回率才是"真正通过的人里被找到的比例"。',
      },
      {
        id: 'eval-q4',
        question: 'K 折交叉验证最主要的目的是?',
        options: [
          '让训练速度更快',
          '更稳定地估计模型在新数据上的表现',
          '减少数据量',
          '增加模型参数',
        ],
        answerIndex: 1,
        explanation:
          '交叉验证通过多次轮流验证取平均,减少单次随机划分带来的偶然性,估计更可靠。',
      },
    ],
  },
  {
    id: 'random-forest',
    title: '随机森林与集成学习',
    icon: '🌲',
    tagline: '多棵树一起投票,比一棵树更稳',
    description:
      '一棵决策树容易"背答案";随机森林用许多棵树投票,让预测更稳定、更可靠。',
    gradient: 'from-emerald-500 to-teal-600',
    lessons: [
      {
        id: 'ensemble-idea',
        title: '集成学习思想',
        intro: '为什么"很多个模型一起投票"比单个模型更靠谱?',
        sections: [
          {
            type: 'objectives',
            items: [
              '理解"多个模型投票"的集成思想',
              '知道一棵决策树为什么容易不稳定',
              '理解随机森林的两个"随机"',
            ],
          },
          {
            type: 'paragraph',
            text: '集成学习的思想很朴素:单个模型容易出错、容易"背答案",那就训练很多个模型,让它们投票表决,多数意见作为最终答案。就像一群人的集体判断,往往比一个人拍板更稳妥。',
          },
          {
            type: 'example',
            title: '一棵树为什么不稳',
            text: '决策树对数据很敏感:训练数据稍微变一点,整棵树的分支就可能大不一样,预测也随之波动。多训练几棵"稍微不一样"的树再投票,就能把这种波动平均掉。',
          },
          {
            type: 'paragraph',
            text: '随机森林的"随机"体现在两处:一是每棵树只看"随机抽取的一部分样本"(有放回抽样),二是每次分裂只从"随机挑选的一部分特征"里选。这两个随机让各棵树彼此不同,投票起来才有效。',
          },
          {
            type: 'summary',
            text: '集成学习靠"多模型投票"降低单个模型的波动;随机森林通过随机抽样本、随机选特征,得到一群差异化的决策树。',
          },
        ],
      },
      {
        id: 'random-forest-practice',
        title: '随机森林实战',
        intro: '用交叉验证对比决策树与随机森林,并读特征重要性。',
        sections: [
          {
            type: 'objectives',
            items: [
              '会用交叉验证对比决策树与随机森林',
              '会读随机森林的特征重要性',
              '会用随机森林预测新样本并输出概率',
            ],
          },
          {
            type: 'paragraph',
            text: '随机森林的 n_estimators 是"树的数量",max_depth 控制每棵树的深度。下面用 5 折分层交叉验证,公平地对比"深度 3 的单棵决策树"和"100 棵树的随机森林"。',
          },
          {
            type: 'code',
            caption: '示例:交叉验证对比决策树与随机森林',
            text: `import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# 特征:第一列学习时间,第二列完成测试次数;标签:0 未通过,1 通过
X = np.array([
    [0.5, 0], [1.0, 0], [1.0, 1], [1.5, 0],
    [1.5, 1], [2.0, 0], [2.0, 1], [2.5, 1],
    [2.5, 2], [3.0, 1], [3.0, 2], [3.5, 1],
    [3.5, 2], [4.0, 2], [4.0, 3], [4.5, 2],
    [4.5, 3], [5.0, 3], [5.5, 3], [6.0, 4],
])
y = np.array([0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
              1, 0, 1, 1, 1, 1, 1, 1, 1, 1])

# 5 折分层交叉验证:保证每折里"通过/不通过"比例一致
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

models = {
    '深度3的决策树': DecisionTreeClassifier(
        max_depth=3, random_state=42
    ),
    '随机森林': RandomForestClassifier(
        n_estimators=100, max_depth=3, random_state=42
    ),
}

for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')
    print(name)
    print('每折准确率:', np.round(scores, 2))
    print(f"平均准确率: {scores.mean():.2%}  标准差: {scores.std():.2%}")

# 用随机森林看特征重要性并预测新样本
forest = RandomForestClassifier(n_estimators=100, max_depth=3, random_state=42)
forest.fit(X, y)
print('特征重要性:', forest.feature_importances_)

new_student = np.array([[2.8, 1]])
pred = forest.predict(new_student)
prob = forest.predict_proba(new_student)[0, 1]
print('预测类型:', pred)
print(f"通过概率: {prob:.2%}")`,
          },
          {
            type: 'output',
            text: `深度3的决策树
每折准确率: [0.75 0.75 1.   0.75 1.  ]
平均准确率: 85.00%  标准差: 12.25%
随机森林
每折准确率: [0.75 0.75 1.   1.   1.  ]
平均准确率: 90.00%  标准差: 12.25%

特征重要性: [0.73 0.27]
预测类型: [1]
通过概率: 78.00%`,
          },
          {
            type: 'paragraph',
            text: '随机森林的平均准确率略高于单棵决策树。特征重要性 [0.73, 0.27] 同样说明"学习时间"更重要;对新样本(学习 2.8 小时、测过 1 次)预测为"通过",概率 78%。',
          },
          {
            type: 'note',
            text: '以上是示意输出,具体数字随随机划分变化;随机森林不保证一定比单棵树好——样本很少或树太少时,两者差别可能不大。',
          },
          {
            type: 'commonMistakes',
            items: [
              '以为森林一定比单棵树好:样本太少或树的数量太少时,优势可能不明显。',
              '把 n_estimators(树的数量)当成树的深度:前者控制"有多少棵",后者才控制"每棵多深"。',
              '忽略可解释性的下降:随机森林比单棵决策树更"黑箱",更难像 export_text 那样直接读出规则。',
            ],
          },
          {
            type: 'summary',
            text: '随机森林 = 多棵决策树 + 随机抽样本 + 随机选特征,最后投票;它通常比单棵树更稳、更不易过拟合,但可解释性下降。',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'rf-q1',
        question: '随机森林的"随机"主要体现在哪两个方面?',
        options: [
          '随机抽样本、随机选特征',
          '随机设学习率、随机设深度',
          '随机打乱标签、随机删除数据',
          '随机初始化权重、随机优化器',
        ],
        answerIndex: 0,
        explanation:
          '每棵树看"随机抽的一部分样本",每次分裂从"随机挑的一部分特征"里选,两个随机让各棵树彼此不同。',
      },
      {
        id: 'rf-q2',
        question: '相比单棵决策树,随机森林的主要优势是什么?',
        options: [
          '更稳定、更不易过拟合',
          '训练一定更快',
          '一定得到更高准确率',
          '更容易解释',
        ],
        answerIndex: 0,
        explanation:
          '多棵树投票能平均掉单棵树的波动,通常更稳定、更不易过拟合;但可解释性反而下降。',
      },
      {
        id: 'rf-q3',
        question: '随机森林的 n_estimators 参数控制什么?',
        options: [
          '每棵树的最大深度',
          '森林中树的数量',
          '学习率的大小',
          '随机抽样的比例',
        ],
        answerIndex: 1,
        explanation: 'n_estimators 是森林中决策树的数量;max_depth 才控制每棵树的深度。',
      },
      {
        id: 'rf-q4',
        question: '随机森林里多棵树对同一个样本给出不同结果时,最终怎么决定?',
        options: [
          '取第一棵树的结果',
          '投票(多数表决)',
          '取结果的平均概率里的最大值',
          '随机挑一棵树的结果',
        ],
        answerIndex: 1,
        explanation:
          '分类任务里,随机森林让每棵树投票,得票最多的类别作为最终预测。',
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
        demo: 'kmeans',
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
