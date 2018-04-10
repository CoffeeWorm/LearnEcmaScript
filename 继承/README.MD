# JavaScript 继承

JavaScript 没有接口等，只能进行实体继承

## 利用原型链进行继承

### 原型链：
- 让原型对象等于另一个类型的实例，另一个原型中也包含着一个指向另一个构造函数，层层递进，就构成了实例与原型的链条。

#### 优点：
- 可以继承父类所有属性，包括父类原型中的属性

#### 缺点：
-  在通过原型来实现继承时，原型实际上会变成另一个类型的实例。原先的实例属性也就变成了现在的原型属性。
-  没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参。

		function Animal(type, sex, age) {
		  this.type = type;
		  this.sex = sex;
		  this.age = age;
		  this.breathe = function() {
		    console.log('I believe I can breathe!');
		  }
		}

		Animal.prototype.alive = function() {
		  console.log('I am living in the world!');
		}

		function Bird() {}
		Bird.prototype = new Animal('flyer', 'female', 20);

		var bird = new Bird();
		console.log(bird, bird.type, bird.sex, bird.age); //Animal {} 'flyer' 'female' 20
		bird.type = '百灵鸟';
		bird.skill = 'fly';
		console.log(bird, bird.type, bird.sex, bird.age); //Animal { type: '百灵鸟', skill: 'fly' } '百灵鸟' 'female' 20
		bird.breathe(); //I believe I can breathe!
		console.log(bird instanceof Animal); // true
		console.log(bird instanceof Object); // true

## 利用call借用构造函数进行继承

#### 缺点：
-  超类原型中定义的方法，子类不能继承，可继承的方法只能写在超类的构造函数中

#### 优点：
-  可以在子类型构造函数中向超类型构造函数传递参数

	
		function Person(name, sex, age) {
		  this.name = name;
		  this.sex = sex;
		  this.age = age;
		  this.speak = function() {
		    console.log(this.name, this.sex, this.age);
		  }
		}

		Person.prototype = {
		  constructor: Person,
		  say: function() {
		    console.log(this.name);
		  }
		}

		function whitePerson(name, sex, age, skill) {
		  Person.apply(this, arguments);
		  this.skill = skill;
		}

		var alex = new whitePerson('alex', 'nan', 18, 'java');
		console.log(alex); //whitePerson {  name: 'alex',  sex: 'nan',  age: 18,  speak: [Function],  skill: 'java' }
		alex.speak(); // alex nan 18
		//alex.say(); //alex.say is not a function

## 组合继承 最常用

#### 优点：
-  结合以上两种方式的优点

#### 缺点：
- 子类的实例原型中存在父类的属性，只不过被子类实例的内部属性屏蔽了
- 无论什么情况下，都会调用两次超类型构造函数

		
		function PC(name) {
		  this.name = name;
		  this.color = ['blue', 'green', 'red'];
		}
		
		PC.prototype.toggle = function() {
		  console.log('I am on/off method');
		}
		
		
		function Laptop(name, logo) {
		  PC.call(this, name);
		  this.logo = logo;
		}
		
		Laptop.prototype = new PC();
		Laptop.prototype.constructor = Laptop;
		Laptop.prototype.movement = function() {
		  console.log('You can take me to anywhere!');
		}
		
		var msiLaptop = new Laptop('mimi', 'msi');
		
		console.log(msiLaptop.color); //[ 'blue', 'green', 'red' ]
		msiLaptop.color.push('white');
		console.log(msiLaptop.color); //[ 'blue', 'green', 'red', 'white' ]
		console.log(Laptop.prototype); //Laptop {  name: undefined,  color: [ 'blue', 'green', 'red' ],  constructor: [Function: Laptop],  movement: [Function] }
		msiLaptop.movement(); //You can take me to anywhere!
		msiLaptop.toggle(); //I am on/off method


##  利用Object.create()原型式继承

	 Object.create() 逻辑类似于：
						function object(o) {
						    function F() {}
						    F.prototype = o;
						    return new F();
	
	
	var waiGuoRen = {
	  name: "Alan",
	  friends: ['Bob', 'Rob']
	}

	var anotherWaiGuoRen = Object.create(waiGuoRen);
	anotherWaiGuoRen.name = 'SpongeBob Square Pants';
	anotherWaiGuoRen.friends.push('Patrick');
	
	var yetAnotherWaiGuoRen = Object.create(waiGuoRen);
	yetAnotherWaiGuoRen.name = 'crab boss';
	yetAnotherWaiGuoRen.friends.push('money');
	
	console.log(anotherWaiGuoRen, anotherWaiGuoRen.friends, yetAnotherWaiGuoRen, yetAnotherWaiGuoRen.friends);
	//{ name: 'SpongeBob Square Pants' } [ 'Bob', 'Rob', 'patrick', 'money' ] { name: 'crab boss' } [ 'Bob', 'Rob', 'patrick', 'money' ]

##  寄生式继承

	
	function createAnother(origin) {
	  var clone = Object.create(origin);
	  clone.hi = function() {
	    console.log('Hi');
	  }
	  return clone;
	}
	
	var person1 = {
	  name: '123',
	  friends: ['Bob', 'Patrick']
	}
	
	var person2 = createAnother(person1);
	person2.hi(); //"Hi"


##  寄生组合式继承

### 优点：
- 不必为了指定子类型的原型而调用超类型的构造函数，避免了在超类的原型上面创建不必要的、多余的属性。与此同时，原型链还能保持不变
	

		function inheritPrototype(subType, superType) {
		  var prototype = Object.create(superType.prototype); //创建对象
		  prototype.constructor = subType; //增强对象
		  subType.prototype = prototype; //指定对象
		}

		function SuperType(name) {
		  this.name = name;
		  this.colors = ["red", "blue", "green"];
		}
		SuperType.prototype.sayName = function() {
		  console.log(this.name);
		};

		function SubType(name, age) {
		  SuperType.call(this, name);
		  this.age = age;
		}
		inheritPrototype(SubType, SuperType);
		SubType.prototype.sayAge = function() {
		  console.log(this.age);
		};
