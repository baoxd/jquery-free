/**
 * desc : 模拟jquery的API
 * author : baoxd
 * date :　 2015-1-13
 */
 
 
(function(window,document){
	
	
	
	
	
	/********************  核心模块 ********************/
	
	/**
	 * @param {} selector
	 * @return {}
	 */
	var $$ = function(selector){
		
		if($$.isFunction(selector)){
			return $$.fn.ready(selector) ;
		}
		
		var regTag  =  /^\s*<([a-zA-Z0-9]+)>(.*)<\/(\1)>\s*$/gi ;
	
		if(regTag.test(selector)){
			return $$.fn.initElement(selector)[0] ;
		}else{
			if( selector instanceof HTMLElement || selector instanceof NodeList){
				return selector ;
			}
			//这个问题以后要解决
			if(selector == document ) {
				return document.documentElement ;
			}
			var result = ( selector === "document" ) ?
					document.documentElement :
					document.querySelectorAll(selector);
			return result ;
			//return ( result && result.length == 1) ? result[0] : result;
		}
	}
	
	
	
	$$.fn = $$.prototype = HTMLElement.prototype ;
	$$.arr = {} ;
	$$.arr.fn = NodeList.prototype ;
	
	
	
	
	
	
	/**
	 * 组件的生成，支持递归生成
	 * 例如：selector ： '<div>111<p>222<span>444</span>555</p>333</div>' 可以生成下面的dom元素
	 * 		<div>
	 *			111
	 *			<p>
	 *				222
	 *				<span>444</span>
	 *				555
	 *			</p>
	 *			333
	 *		</div>
	 *  
	 *  暂时不支持多个同级元素，可以通过下面的方法解决
	 * 
	 */
	$$.fn.initElement = function(selector){
	
		//匹配多个html标签
		//var rr = /(\w*)(<([a-zA-Z]+)>(\w*)<\/\3>\w*)\2*/g ;
		var elements = [] ;
		var regRoot  =  /^\s*<([a-zA-Z0-9]+)>(.*)<\/\1>\s*$/gi ,
			regTag = /^\s*([^<|>]*)<([a-zA-Z0-9]+)>(.*)<\/\2>([^<|>]*)\s*$/gi ;
	
		if(regTag.test(selector)){
			
			regTag.lastIndex = 0 ;
			
			var regTagResult = regTag.exec(selector) ;
				
			var	childTextFirst = regTagResult[1] ,
				
				currNodeTagName = regTagResult[2] ,
				
				nextNodeSelector = regTagResult[3] ,
				
				childTextLast = regTagResult[4] ;
			
			/**
			 * 匹配第一部分
			 */
			if(childTextFirst){
				elements.push(document.createTextNode(childTextFirst))  ;
			}
			
			/**
			 * 匹配第二部分
			 */
			if(currNodeTagName){
				
				var currNode = document.createElement(currNodeTagName) ; 
				
				nextNodes = $$.fn.initElement(nextNodeSelector) ;
				
				if(nextNodes && nextNodes.length > 0){
					
					for(var i = 0 ; i < nextNodes.length ; i++){
						
						currNode.appendChild(nextNodes[i]) ;
						
					}
				}
				elements.push(currNode) ;
			}
			/**
			 * 匹配第三部分
			 */
			if(childTextLast){
				
				elements.push(document.createTextNode(childTextLast))  ;
			}
		}
		if(/^\s*.*\s*$/.test(selector)){
			
			var innerNode = document.createTextNode(selector) ;
			
			elements.push(innerNode) ;
		}
		
		return elements ;
		
	}
	
	
	
	
	
	
	/********************属性、css操作模块*********************/
	
	/**
	 * 属性获取与赋值
	 * @return {}
	 */
	$$.fn.attr = function(){
		
		var attrKey = arguments[0],
		
			attrValue = arguments[1] ;
		
		if(attrValue){
			this.setAttribute(attrKey,attrValue);
		}
		else{
			return this.getAttribute(attrKey);
		}
	}
	
	
	
	
	
	/**
	 *  属性删除
	 */
	$$.fn.removeAttr = function(){
		
		try{
			this.removeAttribute(arguments[0]) ;	
		}
		catch(e){
			console.info(e) ;
		}
	}
	
	
	
	
	/**
	 * class添加
	 */
	$$.fn.addClass = function(){
		
		var newClass = arguments[0],
			classList = this.classList ;
			
	 	try{
	 		classList.add(newClass);
	 	}
	 	catch(e){
	 		console.info(e) ;
	 	}
	}
	
	
	
	
	
	/**
	 * class删除
	 */
	$$.fn.removeClass = function(){
		
		var removeClass = arguments[0] ,
			classList = this.classList ;
		
		if(removeClass){
			classList.remove(removeClass);
		}
	}
	
	
	
	
	
	
	/**
	 * class的toggle替换
	 * @param {} toggleClass
	 */
	$$.fn.toggleClass = function(){
		
		if(!arguments[0]) return this ;
		
		var classList = this.classList ;
		
		classList.toggle(arguments[0])　;
		
	}
	
	
	
	
	
	/**
	 * html的获取和替换
	 * @param {} html
	 */
	$$.fn.html = function(){
		
		var html = arguments[0] ;
		
		if(!html){
			return this.innerHTML ;
		}
		else {
			this.innerHTML = html ;
		}
	}
	
	
	
	
	
	/**
	 * text的获取和替换
	 * @param {} text
	 */
	$$.fn.text = function(){
		
		var text = arguments[0] ; 
		
		if(!text){
			return this.textContent ;
		}
		else{
			this.textContent = text ;
		}
	}
	
	
	
	
	
	/**
	 * value的获取和替换
	 * @param {} val
	 * @return {}
	 */
	$$.fn.val = function(){
		
		var val = arguments[0] ;
		
		if(!val){
			return this.value ;
		}
		else{
			this.value = val ;
		}
	} ;
	
	
	
	
	/**
	 * 定义NodeList的方法
	 */
	['attr','removeAttr','addClass','removeClass','toggleClass','html','text','val'].forEach(function(v,i){
		
		var method = v ;
		
		$$.arr.fn[method] = function(){
			var args = arguments ,
				nodeList = this ,
				result = [] ;
			[]['forEach'].call(nodeList,function(el){
				result.push(el[method].apply(el,args)) ;
			});
			//
			return result[0] ;
		}
	}) ;
	
	
	
	
	
	
	/************************css操作模块*************************/

	/**
	 * 以方法重写dom的style属性
	 * @return {}
	 */
	$$.fn.styles = function(){
		
		if(window.getComputedStyle){
			return window.getComputedStyle(this) ;
		}
		else{
			return this.currentStyle ;
		}
	}
	
	
	
	
	
	/**
	 * css的获取和设置
	 * @param {} name
	 * @param {} value
	 * @return {}
	 */
	$$.fn.css = function(){
		
		var name = arguments[0] , 
			value = arguments[1] ;
		
		if(arguments.length > 2){
			return this ;
		}
		
		if(arguments.length == 2 && !value){
			return this ;
		}
		else if(arguments.length == 2 && name && value){
			if(name in this.style){
				this.style[name] = value ;
			}
			else{
				return this ;
			}
		}
		
		if(name && typeof name == 'string'){
			if(name in this.style){
				return this.styles()[name] ;
			}
			else{
				return null;
			}
		}
		
		if(name && typeof name == 'object'){
			for(var key in name){
				if(key in this.style){
					this.style[key] = name[key] ;
				}
				else{
					continue ;
				}
			}
		}
		return this ;
	}
	
	
	
	
	
	
	/**
	 * 获取组件位置信息
	 * @param {} flag 为true时  获取相对于页面左上角的位置 否则获取相对于父组件的位置
	 * @return {}
	 */
	$$.fn.offset = function(){
		
		var flag = arguments[0] ;
		
		var position = {} ;
		
		if(flag){
			if('getBoundingClientRect' in document.documentElement){
				var box = this.getBoundingClientRect();
				var top = box.top ,
					left = box.left ;
				position['top'] = top ;
				position['left'] = left ; 
			}
		}
		else{
			var top = this.offsetTop ,
				left = this.offsetLeft ;
			position['top'] = top ;
			position['left'] = left ;
		}
		
		return position ;
	}
	
	
	
	
	
	/**
	 * 设置组件scrollTop
	 * @param {} top
	 * @return {}
	*/
	$$.fn.scroTop = function(){
	
		var top = arguments[0] ;
		
		if(!top || isNaN(top)) return this ;
		this.scrollTop = top ;
		return this ;
	}
	
	
	
	
	
	/**
	 * 设置组件scrollLeft
	 * @param {} left
	 * @return {}
	 */
	$$.fn.scroLeft = function(){
		
		var left = arguments[0] ;
		if(!left || isNaN(left)) return this ;
		this.scrollLeft = left ;
		return this ;
	}
	
	
	
	
	/**
	 * 获取和设置组件的高
	 * @param {} val
	 * @return {}
	 */
	$$.fn.height = function() {
		
		var val = arguments[0] ;
		if(!val){
			//style属性用来读写页面元素的行内CSS属性
			return parseFloat(this.css('height')) ;
		}
		else if(isNaN(val)) {
			return null ;
		}
		else{
			this.css('height',val+'px') ;
		}
	}
	
	
	
	
	
	/**
	 * 设置、获取组件的宽
	 * @param {} val
	 * @return {}
	 */
	$$.fn.width = function(){
		
		var val = arguments[0] ;
		
		if(!val){
			return parseFloat(this.css('width'));
		}
		else if(isNaN(val)){
			return null ;
		}
		else{
			this.css('width',val+'px') ;
		}
	}
	
	
	
	
	
	
	/**
	 * 获取组件内部区域高度
	 * @return {}
	 */
	$$.fn.innerHeight = function(){
		
		var height = this.height() ,
			paddingBottom  = this.styles()['paddingBottom'] ,
			paddingTop = this.styles()['paddingTop'] ;
			
		return height + parseFloat(paddingBottom) + parseFloat(paddingTop) ;
	}
	
	
	
	
	
	
	/**
	 * 获取组件内部区域的宽度
	 * @return {}
	 */
	$$.fn.innerWidth = function(){
		
		var width = this.width(),
			paddingLeft = this.styles()['paddingLeft'] ,
			paddingRight = this.styles()['paddingRight'] ;
			
		return width + parseFloat(paddingLeft) + parseFloat(paddingRight) ;
	}
	
	
	
	
	
	
	
	/**
	 * 获取组件的外部高度
	 * @param {} flag 	true:包括margin 
	 * @return {}
	 */
	$$.fn.outerHeight = function(){
		
		var flag = arguments[0] ,
			height = this.height() ,
			paddingBottom = this.styles()['paddingBottom'] ,
			paddingTop = this.styles()['paddingTop'] ,
			borderBottomWidth = this.styles()['borderBottomWidth'] ,
			borderTopWidth = this.styles()['borderTopWidth'] ;
			marginBottom = this.styles()['marginBottom'] ,
			marginTop = this.styles()['marginTop'] ;
		var outerHeight = height + parseFloat(paddingBottom) + parseFloat(paddingTop) 
				+ parseFloat(borderBottomWidth) + parseFloat(borderTopWidth) ;
				
		//默认高度不包括外边框
		if(!flag){
			return outerHeight ;
		}
		else{
			return outerHeight + parseFloat(marginBottom) + parseFloat(marginTop) ;
		}
	}
	
	
	
	
	
	/**
	 * 获取组件的外部宽度，参数为true时包括margin
	 * @return {}
	 */
	$$.fn.outerWidth = function(){
		
		var flag = arguments[0] , 
			width = this.width() ,
			paddingLeft = this.styles()['paddingLeft'] ,
			paddingRight = this.styles()['paddingRight'] ,
			borderLeftWidth = this.styles()['borderLeftWidth'] ,
			borderRightWidth = this.styles()['borderRightWidth'] ;
			marginLeft = this.styles()['marginLeft'] ,
			marginRight = this.styles()['marginRight'] ;
			
		var outerWidth = width + parseFloat(paddingLeft) + parseFloat(paddingRight) 
				+ parseFloat(borderLeftWidth) + parseFloat(borderRightWidth) ;
		
		if(!flag){
			return outerWidth ;
		}
		else{
			return outerWidth + parseFloat(marginLeft) + parseFloat(marginRight) ;	
		}
	} ;
	
	
	
	
	
	/**
	 * 
	 * NodeList定义一下方法
	 * 
	 */
	['css','offset','scroTop','scroLeft','height','width','innerHeight','innerWidth','outerHeight','outerWidth'].forEach(function(v){
		
		var method = v ;
		$$.arr.fn[method] = function(){
			
			var args = arguments ,
				nodeList  = this ,
				result = [] ;
			
			[]['forEach'].call(nodeList,function(el){
				result.push(el[method].apply(el,args)) ;
			}) ;
			return result[0] ;
		}
	}) ;

	
	
	
	
	
	/*************************文档处理模块************************/


	/**
	 * 组件追加子元素
	 * 参数可为字符串和html元素
	 */
	$$.fn.append = function(){
		
		var child = arguments[0] ,
			parentNode = this ;
			
		if(!child) return ;
		
		if(typeof child == 'string'){
			/**
			 * 
			 *   beforebegin：在指定元素之前插入，变成它的同级元素。
			 *   afterbegin：在指定元素的开始标签之后插入，变成它的第一个子元素。
			 *   beforeend：在指定元素的结束标签之前插入，变成它的最后一个子元素。
			 *   afterend：在指定元素之后插入，变成它的同级元素。
			 *
			 */
			parentNode.insertAdjacentHTML('beforeend',child) ;
		}
		else if(child instanceof HTMLElement){
			var childClone = child.cloneNode(true) ;
			parentNode.appendChild(childClone) ;
			if(child.parentNode){
				child.parentNode.removeChild(child) ;
			}
		}
		else if(child instanceof NodeList){
			
			[]['forEach'].call(child,function(v){
				
				if(v && v instanceof HTMLElement){
					var v_clone = v.cloneNode(true) ;
					parentNode.appendChild(v_clone) ;
					if(v.parentNode){
						v.parentNode.removeChild(v) ;
					}
				}
				else{
					return ;
				}
			}) ;
		}
		else if(child instanceof Array){
			
			child.forEach(function(v){
			
				if(v && v instanceof HTMLElement){
					var v_clone = v.cloneNode(true) ;
					parentNode.appendChild(v_clone) ;
					if(v.parentNode){
						v.parentNode.removeChild(v);
					}
				}
				else{
					return ;
				}
				
			}) ;
		}
	}
	
	
	
	
	/**
	 * 
	 * 匹配的组件追加到指定的组件集合中
	 * bxd
	 */
	$$.fn.appendTo = function(){
		
		var parent = arguments[0] ;
		
		if(!parent) return ;
		
		if(typeof parent == 'string'){
			parent = $$(parent) ;
		}
		
		if(parent instanceof HTMLElement){
			
			parent.append(this) ;
			
		}
		
		if(parent instanceof NodeList){
			
			var child = this ;
			
			[]['forEach'].call(parent,function(v,i){
				
				var child_clone = child.cloneNode(true) ;
				v.append(child_clone);
				
			}) ;
			
			if(child.parentNode){
				child.parentNode.removeChild(child) ;
			}
			
		}
		
	}
	
	
	
	
	
	
	/**
	 * 在组件头部添加子元素
	 * 参数可为字符串和html元素
	 * 
	 */
	$$.fn.prepend = function(){
		
		var child = arguments[0] ,
			parentNode = this ;	
		
		if(!child) return ;
		
		var childNodes = parentNode.childNodes ;
		if(typeof child == 'string'){
			
			
			/**
			 * 
			 *   beforebegin：在指定元素之前插入，变成它的同级元素。
			 *   afterbegin：在指定元素的开始标签之后插入，变成它的第一个子元素。
			 *   beforeend：在指定元素的结束标签之前插入，变成它的最后一个子元素。
			 *   afterend：在指定元素之后插入，变成它的同级元素。
			 *
			 */
			parentNode.insertAdjacentHTML('afterbegin',child) ;
		}
		else if(child instanceof HTMLElement){
			
			if(childNodes && childNodes.length > 0){
				var childClone = child.cloneNode(true) ;
				parentNode.insertBefore(childClone,childNodes[0]) ;
				if(child.parentNode){
					child.parentNode.removeChild(child) ;
				}
			}
			else{
				parentNode.append(child) ;
			}
		}
		else if(child instanceof NodeList){
			
			[]['forEach'].call(child,function(v){
				
				if(v instanceof HTMLElement){
					
					childNodes = parentNode.childNodes ;
					var v_clone = v.cloneNode() ;
					if(childNodes && childNodes.length > 0){
						parentNode.insertBefore(v_clone,childNodes[0]) ;
						
					}
					else{
						parentNode.append(v_clone) ;
					}
					if(v.parentNode){
						v.parentNode.removeChild(v); 
					}
				}
				else 
					return ;
			}) ;
		}
		else if(child instanceof Array){
			
			child.forEach(function(v){
				
				if(v instanceof HTMLElement){
					
					childNodes = parentNode.childNodes ;
					var v_clone = v.cloneNode() ;
					if(childNodes && childNodes.length > 0){
						parentNode.insertBefore(v_clone,childNodes[0]) ;
					}
					else{
						parentNode.append(v_clone) ;
					}
					if(v.parentNode){
						v.parentNode.removeChild(v);
					}
				}
				else
					return ;
				
			}) ;
		}
	}
	
	
	
	
	/**
	 * 
	 * 匹配的组件添加到指定的组件集合头部
	 * 
	 */
	$$.fn.prependTo = function(){
		
		var parent = arguments[0] ;
		
		if(!parent) return ;
		
		if(typeof parent == 'string'){
			parent = $$(parent) ;
		}
		
		if(parent instanceof HTMLElement){
			parent.prepend(this) ;
		}
		
		if(parent instanceof NodeList){
			
			var child = this ;
			
			[]['forEach'].call(parent,function(v,i){
				
				var child_clone = child.cloneNode(true) ;
				v.prepend(child_clone);
				
			}) ;
			
			if(child.parentNode){
				
				child.parentNode.removeChild(child) ;
				
			}
			
		}
	}
	
	
	
	
	/**
	 * 
	 * 在匹配组件后追加 
	 * 参数可为字符串和html元素
	 * 
	 */
	$$.fn.after = function(){
		
		var insertNode = arguments[0] ;
		
		if(!insertNode) return ;
		
		if( typeof insertNode == 'string'){
			 
			this.insertAdjacentHTML('afterend',insertNode) ;
			
		}
		
		var parentNode = this.parentNode ,
			
			nextNode = this.nextSibling ;
		
		if(insertNode instanceof HTMLElement){
				
			if(nextNode){
				parentNode.insertBefore(insertNode,nextNode) ;
			}
			
			else{
				parentNode.appendChild(insertNode) ;
			}
		}
		
		if(insertNode instanceof NodeList){
			[]['forEach'].call(insertNode,function(v){
			
				if(v instanceof HTMLElement){
					if(nextNode){
						parentNode.insertBefore(v,nextNode) ;
					}
					else{
						parentNode.appendChild(v) ;
					}
				}
			}) ;
		}
	}
	
	
	
	
	
	/***
	 * 在匹配组件前添加元素
	 * 参数可为字符串和组件
	 */
	$$.fn.before = function(){
		
		var insertNode = arguments[0] ,
			parentNode = this.parentNode ;
		
		if(!insertNode || !parentNode) return ;
		
		if(typeof insertNode == 'string'){
			this.insertAdjacentHTML('beforebegin',insertNode) ;
		}
		if(insertNode instanceof HTMLElement){
			parentNode.insertBefore(insertNode,this) ;
		}
		if(insertNode instanceof NodeList){
			[]['forEach'].call(insertNode,function(v){
				if(v instanceof HTMLElement){
					parentNode.insertBefore(v,this) ;
				}
			}) ;
		}
		
	}
	
	
	
	
	/***
	 * 把匹配元素插入到指定元素集合后
	 */
	$$.fn.insertAfter = function(){
		
		var prevNode = arguments[0] ;
		
		if(!prevNode) return ;
		
		if(prevNode instanceof  HTMLElement){
			
			prevNode.after(this) ;
			
		}
		
		if(prevNode instanceof  NodeList){
			
			var afterNode = this;
			
			[]['forEach'].call(prevNode,function(v){
				afterNode_clone = afterNode.cloneNode(true) ;
				v.after(afterNode_clone) ;
			}) ;
			
			if(afterNode.parentNode){
				afterNode.parentNode.removeChild(afterNode) ;
			}
		}
	}
	
	
	
	
	/**
	 * 把匹配的元素插入到指定元素集合前
	 */
	$$.fn.insertBef = function(){
		
		var nextNode = arguments[0] ;
		
		if(!nextNode) return ;
		
		if(typeof nextNode == 'string'){
			nextNode = $$(nextNode) ;
		}
		
		if(nextNode instanceof  HTMLElement){
			
			nextNode.before(this) ;
			
		}
		
		if(nextNode instanceof  NodeList){
			
			var prevNode = this;
			
			[]['forEach'].call(nextNode,function(v){
				
				prevNode_clone = prevNode.cloneNode(true) ;
				v.before(prevNode_clone) ;
			}) ;
			
			if(prevNode.parentNode){
				prevNode.parentNode.removeChild(prevNode) ;
			}
		}
	
	}
	
	
	
	
	
	/**
	 * 指定元素环绕匹配元素
	 * 
	 */
	$$.fn.wrap = function(){
		
		var wrap = arguments[0] ;
		
		if(!wrap) return ;
		
		//传入参数为字符串
		if(typeof wrap == 'string'){
			wrap = $$(wrap) ;	
		}
		wrap.appendChild(this.cloneNode(true)) ;
		
		if(!this.parentNode) return ;
		
		this.parentNode.replaceChild(wrap,this) ;
	}
	
	
	
	
	
	/**
	 * 取消匹配元素的父元素
	 */
	$$.fn.unwrap = function(){
		
		var innerNode = this ,
			innerNodeClone = this.cloneNode(true) ,
			parentNode = this.parentNode ,
			parentParentNode = parentNode.parentNode ;
			
		parentNode.removeChild(innerNode) ;
		
		//parentParentNode.replaceChild(innerNodeClone,parentNode) ;
		parentParentNode.insertBefore(innerNodeClone,parentNode) ;
		parentParentNode.removeChild(parentNode);
		
	}
	
	
	
	
	
	/**
	 * NodeList的unwrap方法和HTMLElement的unwrap方法逻辑不一样 ，在此单独拿出
	 * 
	 */
	$$.arr.fn.unwrap = function(){
		
		if(!(this instanceof NodeList) || this.length <= 0)
			return ;
			
		var parentNodes = [] ,
			
			parentNode = this[0].parentNode ;
			
			parentNodes.push(parentNode) ;
			
		//this分为两种情况 1.this中的Node为同级兄弟节点	2.this中的节点非同级兄弟节点
		
			
		[]['forEach'].call(this,function(v){
		
			var currParentNode = v.parentNode ,
				f = false ;
			
			for(var i = 0 ; i < parentNodes.length ; i++){
				if(currParentNode.isEqualNode(parentNodes[i])){
					f = true ;
				}
			}
			
			if(!f){
				parentNodes.push(currParentNode);
			}
		}) ;
		
		parentNodes.forEach(function(v){
		
			var unwrapNode = v ,
				unwrapParent = v.parentNode ,
				childNodes = v.childNodes ;
				
			if(childNodes && childNodes.length > 0){
				[]['forEach'].call(childNodes,function(vv){
					
					unwrapParent.insertBefore(vv.cloneNode(true),unwrapNode) ;
				}) ;
				unwrapParent.removeChild(unwrapNode) ;
			}
			return ;
		});
	}
	
	
	
	
	
	/**
	 * 将匹配的元素集合环绕  和 wrap不同
	 */
	$$.arr.fn.wrapAll = function(){
		
		var wrap = arguments[0] ;
			
		if(!wrap) return ;
		
		if(typeof wrap == 'string'){
			wrap = $$(wrap) ;
		}
		
		if(!(this instanceof NodeList) || this.length <= 0) return ;
		
		var parentNode = this[0].parentNode ;
		
		[]['forEach'].call(this,function(v){
			
			var currParentNode = v.parentNode ;
			
			if(!currParentNode.isEqualNode(parentNode)){
				return ;
			}
			
			var childClone = v.cloneNode(true) ;
			
			wrap.appendChild(childClone) ;
			
			parentNode.replaceChild(wrap,v) ;
			
		}) ;
		
	}
	
	
	
	
	
	/***
	 * 将所有匹配的元素的内部子元素用指定元素环绕
	 */
	$$.fn.wrapInner = function(){
		
		var wrap = arguments[0] ;
		
		if(!wrap) return ;
		
		if(typeof wrap == 'string'){
			wrap = $$(wrap) ;
		}
		
		var childs = this.childNodes ;
		
		if(!childs || childs.length <= 0){
			this.appendChild(wrap) ;
			return ;
		}
		
		childs.wrapAll(wrap) ;
		
		return ;
	}
	
	
	
	
	
	/**
	 * 将匹配元素用指定元素替换
	 */
	$$.fn.replaceWith = function(){
		
		var rep = arguments[0] ;
		if(!rep || !this.parentNode) return ;
		
		if(typeof rep == 'string'){
			rep = $$(rep) ;
		}
		this.parentNode.replaceChild(rep,this) ;
	}
	
	
	
	
	
	/***
	 * 	将匹配元素替换掉指定元素集合
	 * 
	 * *****本方法不给NodeList提供*****
	 * 
	 */
	$$.fn.replaceAll = function(){
		
		var args = arguments[0] ;
		if(!args) return ;
		
		if(typeof args == 'string'){
			args = $$(args) ;
		}
		
		if(args instanceof HTMLElement){
			args.replaceWith(this) ;
			return ;
		}
		if(args instanceof NodeList){
			var rep = this;
			[]['forEach'].call(args,function(v){
				repClone = rep.cloneNode(true) ;
				v.replaceWith(repClone) ;
			}) ;
		}
		
		if(this.parentNode){
			this.parentNode.removeChild(this) ;
		}
	}
	
	
	
	
	
	/***
	 * 清空匹配元素的子元素
	 */
	$$.fn.empty = function(){
		
		var childs = this.childNodes ;
		if(!childs || childs.length <= 0) return ;
		
		for(var i = childs.length - 1 ; i >=0 ; i--){
			this.removeChild(childs[i]) ;
		}
	}
	
	

	
	/**
	 * 删除匹配的元素，如果有参数 ， 则删除匹配参数的元素
	 * 
	 */
	$$.fn.remove = function(){
		
		var arg = arguments[0] ,
			
			removeNode = this ;
		
		if(!arg){
			if(removeNode.parentNode){
				removeNode.parentNode.removeChild(removeNode) ;
			}
			return removeNode;
		}
		else{
			
			if(typeof arg == 'string'){
				
				regNodes = $$(arg) ;
				
				if(regNodes instanceof NodeList){
					
					for(var i = 0 ; i < regNodes.length ; i++){
						
						var v = regNodes[i] ;
						
						if(v.isEqualNode(removeNode)){
							
							removeNode.parentNode.removeChild(removeNode) ;
							
							return removeNode;
						}
					}
				}
				else
					return this ;
			}
			else {
				
				if(arg instanceof HTMLElement){
					
					if(arg.isEqualNode(removeNode)){
							
						removeNode.parentNode.removeChild(removeNode) ;
						
						return removeNode;
					}
				}
				else if(arg instanceof NodeList){
					
					for(var i = 0 ; i < arg.length ; i++){
						
						var v = arg[i] ;
						
						if(v.isEqualNode(removeNode)){
							
							removeNode.parentNode.removeChild(removeNode) ;
							
							return removeNode;
							
						}
					}
				}
			}
		}
	}
	
	
	
	
	/**
	 * 元素克隆
	 * @return {}
	 */
	$$.fn.clone = function(){
		
		var f = arguments[0] ;
		return (!f) ?  this.cloneNode() : this.cloneNode(true) ;
	}
	
	
	
	
	$$.arr.fn.clone = function(){
		
		var f = arguments[0] ,
			result = [] ;
			
			if(!(this instanceof NodeList) || this.length <= 0) return ;
			
			[]['forEach'].call(this,function(v){
			
				result.push(v.cloneNode(f)) ;
				
			});
		
			return result ;
	};
	
	
	
	
	['append','appendTo','prepend','prependTo','after','before','insertAfter','insertBef','wrap','wrapInner','replaceWith','empty','remove'].forEach(function(method){
	
		var method = method ;
		
		$$.arr.fn[method] = function(){
			var args = arguments ,
				nodeList = this ,
				result = [] ;
				
				[]['forEach'].call(nodeList,function(el){
					result.push(el[method].apply(el,args)) ;
				}) ;
				return result[0] ;
		}
	}) ;
	
	
	
	
	
	
	
	
	/*************************筛选***********************/
	$$.fn.eq = function(){
		
		var index = arguments[0] ;
		if(index == null || index == undefined || index > 0 || index < -1 || isNaN(index)) return null;
		
		return this ;
	}
	
	
	
	/**
	 * 获取指定位置的元素
	 */
	$$.arr.fn.eq = function(){
		
		var index = arguments[0] ;
		if(index == null || index == undefined || isNaN(index)) return null ;
		if(index >= 0){
			if(index > this.length){
				return null ;
			}
			else{
				return this[index] ;
			}
			
		}
		else{
			if(index < -this.length){
				return null ;
			}
			else{
				return this[this.length + index] ;
			}
		}
		
	}
	
	
	
	
	$$.fn.first = $$.fn.last = function(){
		return this ;
	}
	
	
	
	
	
	/**
	 * 获取元素集合第一个元素（本方法是定义在元素集合上的）
	 */
	$$.arr.fn.first = function(){
		
		if(this.length <=0) return null ;
		return this[0] ;
		
	}
	
	
	
	
	/**
	 * 获取元素集合最后一个元素
	 */
	$$.arr.fn.last = function(){
		
		if(this.length <=0 ) return null; 
		return this[this.length-1] ;
		
	}
	
	
	
	
	/**
	 * 判断元素是否有某个class
	 * 元素集合的该方法  单独
	 */
	$$.fn.hasClass = function(){
		var clazz = arguments[0];
		
		if(!clazz) return false ;
		
		var classList = this.classList ;
		return classList.contains(clazz) ;
	}
	
	
	
	
	
	
	/**
	 * 判断元素集合中是否有元素含有指定的class,只要有一个元素含有该class就返回true 否则返回false
	 */
	$$.arr.fn.hasClass = function(){
		
		var clazz = arguments[0] ;
		if(!clazz || this.length <=0) return false;

		var hasClass = false ;
		[]['forEach'].call(this,function(v){
			if(hasClass){
				return ;
			}
			else{
				var classList = v.classList ;
				hasClass = classList.contains(clazz);
			}
		}) ;		
		
		return hasClass;
		
	}
	
	
	
	
	
	$$.fn.filter = function(){
		
		var arg = arguments[0] ,filterNode = this ;
		
		if(!arg) return null ;
		
		var selectorNodes = regSelectorNodes(arg);
		if(selectorNodes.length > 0){
			var f = false ;
			for(var i = 0 ; i < selectorNodes.length ; i++ ){
				var seleNode = selectorNodes[i] ,
					seleNodeArr = null ;
				
				if(seleNode instanceof HTMLElement){
					seleNodeArr = [] ;
					seleNodeArr.push(seleNode) ;
				}
				else if(seleNode instanceof NodeList){
					seleNodeArr = seleNode
				}
				
				[]['forEach'].call(seleNodeArr,function(v){
					
					if(!f && filterNode.isEqualNode(v)){
						f = true ;
					}
					
				}) ;
				
				if(f){
					return filterNode ;
				}
					
			}
			
		}
		else 
			return null;
	}
	
	
	
	
	
	/**
	 * 元素集合过滤，参数可为字符串、元素或元素集合 数组 自定义的过滤函数
	 */
	$$.arr.fn.filter = function (){
		
		var arg = arguments[0] ,result = [] ,filterNodes = this ;
			
			if(!arg) return null ;
			
			var selectorNodes = [] ;
			
			//参数为匹配选择器字符串
			if(typeof arg == 'string'){
				if(arg.indexOf(',') > 0){
					var selecs= arg.split(',') ;
					
					for(var i = 0 ; i < selecs.length ; i++){
						var tmpNode = $$(selecs[i]) ;
						if(tmpNode && tmpNode instanceof NodeList && tmpNode.length > 0){
							selectorNodes.push(tmpNode) ;
						}
					}
					
				}
				else{
					var tmpNode = $$(arg) ;
					if(tmpNode && tmpNode instanceof NodeList && tmpNode.length > 0){
						selectorNodes.push(tmpNode);
					}
				}
			}
			//参数为匹配元素或元素集合
			if(arg instanceof HTMLElement || arg instanceof NodeList){
				selectorNodes.push(arg);
			}
			//参数为匹配元素数组
			if(arg instanceof Array){
				for(var i = 0 ; i < arg.length ; i++){
					if(arg[i] instanceof HTMLElement || arg[i] instanceof NodeList){
						selectorNodes.push(arg[i]) ;
					}
				}
			}
			
			if(selectorNodes.length > 0){
				for(var i = 0 ; i < selectorNodes.length ; i++ ){
					var seleNode = selectorNodes[i] ,
						seleNodeArr = null ;
					
					if(seleNode instanceof HTMLElement){
						seleNodeArr = [] ;
						seleNodeArr.push(seleNode) ;
					}
					else if(seleNode instanceof NodeList){
						seleNodeArr = seleNode
					}
					[]['forEach'].call(seleNodeArr,function(v){
						
						[]['forEach'].call(filterNodes,function(vv){
						
							if(!vv['used'] && vv && vv instanceof HTMLElement && vv.isEqualNode(v)){
								vv['used'] = true ;
								result.push(vv) ;
							}
						}) ;
						
					}) ;
				}
				
				return result;
			}
			
			//参数为自定义过滤函数
			if(arg  instanceof Function){
				[]['forEach'].call(filterNodes,function(v,i){
					var filterFlag = arg.apply(v,[i,v]) ;
					if(filterFlag){
						result.push(v) ;
					}
				}); 
				
				return result ;
			}
	}
	
	
	
	
	
	function regSelectorNodes(){
		var arg = arguments[0] ,selectorNodes = [];
		if(!arg) return null ;
		
		//参数为匹配选择器字符串
		if(typeof arg == 'string'){
			if(arg.indexOf(',') > 0){
				var selecs= arg.split(',') ;
				
				for(var i = 0 ; i < selecs.length ; i++){
					var tmpNode = $$(selecs[i]) ;
					if(tmpNode && tmpNode instanceof NodeList && tmpNode.length > 0){
						selectorNodes.push(tmpNode) ;
					}
				}
				
			}
			else{
				var tmpNode = $$(arg) ;
				if(tmpNode && tmpNode instanceof NodeList && tmpNode.length > 0){
					selectorNodes.push(tmpNode);
				}
			}
		}
		//参数为匹配元素或元素集合
		if(arg instanceof HTMLElement || arg instanceof NodeList){
			selectorNodes.push(arg);
		}
		//参数为匹配元素数组
		if(arg instanceof Array){
			for(var i = 0 ; i < arg.length ; i++){
				if(arg[i] instanceof HTMLElement || arg[i] instanceof NodeList){
					selectorNodes.push(arg[i]) ;
				}
			}
		}
		return selectorNodes ;
	}
	
	
	
	
	
	
	
	
	/**
	 * 根据选择器、元素来检测匹配元素集合，如果其中至少有一个元素符合这个给定的表达式就返回true
	 */
	$$.fn.is = function(){
		
		var arg = arguments[0] ,currNode = this ;
		if(!arg) return false ;
		
		if(typeof arg == 'string'){
			arg = $$(arg) ;
		}
		
		var f = false ;
		if(arg && arg instanceof NodeList && arg.length > 0){
			[]['forEach'].call(arg,function(v){
				if(f){
					return ;
				}
				if(v.isEqualNode(currNode)){
					f = true ;
				}
			}) ;
			return f ;
		}
		else{
			return false ;
		}
	}
	
	
	
	
	/**
	 * 元素集合匹配检测
	 */
	$$.arr.fn.is = function(){
		
		var arg = arguments[0] ,f = false ;
		if(!arg || this.length <= 0) return false ;
		
		[]['forEach'].call(this,function(v){
			if(f) return ;
			f = v.is(arg) ;
		});
		
		return f ;
	}
	
	
	
	
	/**
	 * 将一组元素转换成其他数组（不论是否是元素数组）
	 */
	$$.fn.map = function(){
		var callback = arguments[0] ,result = [];

		if(!callback || !(callback instanceof Function)) return null;
		
		result.push(callback.call(this)) ;
		return result ;		
	}
	
	
	
	
	
	/**
	 * 将一组元素转换成其他数组（不论是否是元素数组）
	 */
	$$.arr.fn.map = function(){
		var callback = arguments[0] ,result = [];
		if(!callback || !(callback instanceof Function)) return null;
		
		[]['forEach'].call(this,function(v){
			result.push(callback.call(v)) ;
		}) ;
		return result ;
	}
	
	
	
	
	
	/**
	 * 保留包含特定后代的元素，去掉那些不含有指定后代的元素
	 */
	$$.fn.has = function(){
		var arg = arguments[0],currNode = this;
		if(!arg) return null;
		
		if(typeof arg == 'string'){
			arg = $$(arg) ;
		}
		
		if(arg instanceof HTMLElement){
			if(currNode.contains(arg) && !currNode.isEqualNode(arg)) return currNode ;
			else return null ;
		}
		
		if(arg instanceof NodeList){
			var f = false ;
			[]['forEach'].call(arg,function(v){
				if(f) return ;
				if(currNode.contains(v) && !currNode.isEqualNode(v)) {
					f = true ;
				}
			}) ;
			if(f) return currNode ;
			else return null ;
		}
	}
	
	
	
	
	/**
	 * 保留包含特定后代的元素，去掉那些不含有指定后代的元素
	 */
	$$.arr.fn.has = function(){
		var arg = arguments[0],currNodes = this,result = [];
		if(!arg) return null;
		
		[]['forEach'].call(currNodes,function(v){
			var ishas = v.has(arg) ;
			if(ishas){
				result.push(ishas) ;
			}
		}) ;
		return result ;
	}
	
	
	
	
	/**
	 * 删除与指定表达式匹配的元素
	 */
	$$.fn.not = function(){
		var arg = arguments[0] ,currNode = this;
		if(!arg) return this ;
		
		if(typeof arg == 'string') arg = $$(arg) ;
		var f = false ;
		if(arg instanceof HTMLElement){
			if(currNode.isEqualNode(arg)){
				f = true ;
			}
		}
		if(arg instanceof NodeList){
			[]['forEach'].call(arg,function(v){
				if(f) return ;
				if(currNode.isEqualNode(v)){
					f = true ;
				}
			}) ;
		}
		if(f) return null;
		else return currNode ;
	}
	
	
	
	
	
	
	/**
	 * 删除与指定表达式匹配的元素
	 */
	$$.arr.fn.not = function(){
		var arg = arguments[0],currNodes = this,result = [];
		if(!arg) return null;
		
		[]['forEach'].call(currNodes,function(v){
			var isNot = v.not(arg) ;
			if(isNot){
				result.push(isNot) ;
			}
		}) ;
		return result ;
	}
	
	
	
	
	
	
	/**
	 * 选取一个匹配的子集
	 */
	$$.fn.slice = function(){
		var start = arguments[0],end = arguments[1] ;
		var reg = /^-?\d+$/ ;
		if(isNaN(start) || start > 0 || start <-1 || !reg.test(start)) return null;
		
		if(end == null || end == undefined) return this ;
		if((start == 0 && end > 0 && reg.test(end)) || (start == -1 && end < -1 && reg.test(end))) return this ;
		else return null ;
	}
	
	
	
	
	/**
	 * 选取一个匹配的子集
	 */
	$$.arr.fn.slice = function(){
		var start = arguments[0],end = arguments[1] ,result = [];
		var reg = /^-?\d+$/ ;
		
		if(isNaN(start) ||　!reg.test(start)) return null ;
		
		if(end == null || end == undefined){
			result = []['slice'].call(this,start);
			return result ;
		}
		else{
			if(isNaN(end) ||　!reg.test(end)){
				return null;
			}
			else{
				result = []['slice'].call(this,start,end);
				return result ;
			}
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	/***********************查找******************/
	
	/**
	 * 查找元素的子节点
	 */
	$$.fn.childs = function(){
		var arg = arguments[0],childs = this.childNodes,result = [] ;
		
		if(!arg) return childs ;
		
		arg = regSelectorNodes(arg) ;
		if(arg && arg.length > 0){
			for(var i = 0 ; i < arg.length ; i++){
				var selectorNode = arg[i] ,tmpNodesArr = [] ;
				if(selectorNode instanceof HTMLElement){
					tmpNodesArr.push(selectorNode) ;
				}
				if(selectorNode instanceof NodeList){
					tmpNodesArr = selectorNode ;
				}
				
				[]['forEach'].call(childs,function(child){
					[]['forEach'].call(tmpNodesArr,function(tmpNode){
						if(child.isEqualNode(tmpNode)){
							result.push(child) ;
						}
					});
				}) ;
			}
		}
		
		return result ;
	}
	
	
	
	
	/**
	 *  查找元素的子节点
	 */
	$$.arr.fn.childs = function(){
		var arg = arguments[0] , result = [],currNodes = this  ;
		
		[]['forEach'].call(currNodes,function(currNode){
			result = result.concat(currNode.childs(arg));
		}) ;
		return result ;
	}
	
	
	
	
	
	/**
	 * 从元素本身开始，逐级向上级元素匹配，并返回最先匹配的元素
	 * 参数暂不支持多个参数
	 */
	$$.fn.closest = function(){
		var arg = arguments[0] ,result = null;
		
		arg = $$(arg) ;
		if(!arg) return null ;
		
		var f = false
		if(arg instanceof HTMLElement){
			if(this.isEqualNode(arg)){ result = this ; f = true}
			
		}
		if(arg instanceof NodeList){
			var currNode = this ;
			[]['forEach'].call(arg,function(selectorNode){
				if(currNode.isEqualNode(selectorNode) && !f){
					result = selectorNode ;
					f = true ;
				}
			}) ;
		}
		if(f) return result ;
		else{
			if(this.parentNode.nodeName != 'HTML'){
				result = this.parentNode.closest(arg) ;
				return result ;
			}
			else{
				return null ;
			}
		}
	}
	
	
	
	
	
	/**
	 * 从元素本身开始，逐级向上级元素匹配，并返回最先匹配的元素
	 * 参数暂不支持多个参数
	 */
	$$.arr.fn.closest = function(){
		var arg = arguments[0] ,result = [];
		
		arg = $$(arg) ;
		if(!arg) return null ;
		
		[]['forEach'].call(this,function(v){
			var currParNode = v.closest(arg) ,f = false ;
			if(currParNode){
				for(var i= 0 ; i < result.length ; i++){
					if(currParNode.isEqualNode(result[i]) ){
						f = true ;
					}
				}
				if(!f) result.push(currParNode) ;
			}
			
		}) ;
		return result ;
		
	}
	
	
	
	
	
	/**
	 * 	搜索所有与指定表达式匹配的元素。这个函数是找出正在处理的元素的后代元素的好方法。
	 *	所有搜索都依靠jQuery表达式来完成。这个表达式可以使用CSS1-3的选择器语法来写
	 *
	 */
	$$.fn.find = function(){
		
		var arg = arguments[0] ,result = [],currNode = this ;
		
		if(!arg) return null; 
		arg = regSelectorNodes(arg) ;
		if(arg && arg.length > 0){
			for(var i = 0 ; i < arg.length ; i++ ){
				var selectorNode = arg[i] ,tmpSelectorArr = [];
				if(selectorNode instanceof HTMLElement){
					tmpSelectorArr.push(selectorNode) ;
				}
				if(selectorNode instanceof NodeList){
					tmpSelectorArr = selectorNode ;
				}
				var childNodes = currNode.childNodes ;
				if(childNodes && childNodes.length > 0){
					[]['forEach'].call(childNodes,function(currChildNode){
						
						if(currChildNode.nodeType == 1){
							
							[]['forEach'].call(tmpSelectorArr,function(tmpSelector){
								if(tmpSelector instanceof HTMLElement){
									if(currChildNode.isEqualNode(tmpSelector)){
										result.push(currChildNode) ;
									}
								}
								if(tmpSelector instanceof NodeList){
									[]['forEach'].call(tmpSelector,function(tmpNode){
										if(currChildNode.isEqualNode(tmpNode)){
											result.push(currChildNode) ;
										}
									}) ;
								}
							}) ;
							result = result.concat(currChildNode.find(arg)) ;
						}
					}); 
				}
			}
		}
		return result ;
	}
	
	
	
	
	
	/**
	 * 	搜索所有与指定表达式匹配的元素。这个函数是找出正在处理的元素的后代元素的好方法。元素集合实现方式
	 *	所有搜索都依靠jQuery表达式来完成。这个表达式可以使用CSS1-3的选择器语法来写
	 *
	 */
	$$.arr.fn.find = function(){
		var arg = arguments[0] ,result = [];
		
		if(!arg) return null ;
		
		[]['forEach'].call(this,function(currNode){
			if(currNode.nodeType == 1){
				result = result.concat(currNode.find(arg)) ;
			}
		}) ;
		return result ;
	}
	
	
	
	
	
	
	/**
	 * 找到每个段落的后面紧邻的同辈元素
	 */
	$$.fn.next = function(){
		var arg = arguments[0] ,result = [];
		
		var nextSibling = this.nextSibling ;
		
		while(nextSibling.nodeType !=1){
			nextSibling = nextSibling.nextSibling ;
		}
		if(nextSibling && nextSibling.nodeType == 1){
			result.push(nextSibling) ;
		}
		
		
		arg = regSelectorNodes(arg) ;
		if(arg){
			result = $$.filterMatchNodes(nextSibling,arg);
		}
		
		return result ;
	}
	
	
	
	
	
	/**
	 * 找到每个段落的后面紧邻的同辈元素
	 */
	$$.arr.fn.next = function(){
		var arg = arguments[0] ,result = [];
		
		[]['forEach'].call(this,function(currNode){
			result = result.concat(currNode.next(arg)) ;		
		}) ;
		return result ;
	}
	
	
	
	
	
	
	/**
	 * 查找当前元素之后所有的同辈元素
	 */
	$$.fn.nextAll = function(){
		var arg = arguments[0],result = [],nextAllNode = [] ;
		var nextSibling = this.nextSibling ;
		n = 1 ;
		while(nextSibling){
			if(nextSibling.nodeType == 1){
				nextAllNode.push(nextSibling) ;
			}
			nextSibling  = nextSibling.nextSibling ;
		}
		result = nextAllNode ;
		
		arg = regSelectorNodes(arg) ;
		if(arg){
			result = [] ;
			if(nextAllNode && nextAllNode.length > 0){
				for(var i = 0 ; i < nextAllNode.length ; i++){
					result = result.concat($$.filterMatchNodes(nextAllNode[i],arg));
				}
			}
		}
		
		return result ;
	}
	
	
	
	
	
	
	/**
	 * 查找当前元素之后所有的同辈元素
	 */
	$$.arr.fn.nextAll = function(){
		var arg = arguments[0],result = [] ;
		[]['forEach'].call(this,function(currNode){
			
			var currResult = currNode.nextAll(arg) ;
			
			for(var i = 0 ; i < currResult.length ; i++){
				var f = false ;
				for(var j = 0 ; j < result.length ; j++){
					if(currResult[i].isEqualNode(result[j]) && currResult[i].parentNode.isEqualNode(result[j].parentNode)){
						f = true ;
					}
				}
				if(f) return ;
				else result.push(currResult[i]) ;
			}
		}) ;
		return result ;
	}
	
	
	
	
	
	
	
	/***
	 * 查找当前元素之后所有的同辈元素，直到遇到匹配的那个元素为止
	 */
	$$.fn.nextUntil = function(){
		var arg = arguments[0] ,result = [],nextAllNode = [];
		
		arg = regSelectorNodes(arg) ;
		result = nextAllNode = this.nextAll() ;
		if(arg){
			result = [] , i = 0,n = 1;
			var regNode = $$.filterMatchNodes(nextAllNode[i],arg) ;
			while((!regNode || regNode.length <= 0) && n <= nextAllNode.length){
				result.push(nextAllNode[i]) ;
				regNode = $$.filterMatchNodes(nextAllNode[++i],arg) ;
				++n ;
			}
		}
		return result ;
	}
	
	
	
	
	
	
	
	/**
	 * 查找当前元素之后所有的同辈元素，直到遇到匹配的那个元素为止
	 */
	$$.arr.fn.nextUntil = function(){
		var arg = arguments[0],result = [] ;
		[]['forEach'].call(this,function(currNode){
			result = result.concat(currNode.nextUntil(arg)) ;
		}) ;
		return result ;
	}
	
	
	
	
	
	
	
	/**
	 * 返回第一个匹配元素用于定位的父节点
	 */
	$$.fn.offsetPar = function(){
		var result = [] ;
		result.push(this.offsetParent) ;
		return result;
	}
	
	
	
	
	
	
	
	/**
	 * 返回第一个匹配元素用于定位的父节点
	 */
	$$.arr.fn.offsetPar = function(){
		var result = [] ;
		[]['forEach'].call(this,function(currNode){
			result = result.concat(currNode.offsetPar()) ;
		}) ;
		return result ;
	}
	
	
	
	
	
	
	
	
	/**
	 * 取得一个包含着所有匹配元素的唯一父元素的元素集合
	 */
	$$.fn.parent = function(){
		var arg = arguments[0] , result = [],parent = this.parentNode;
		arg = regSelectorNodes(arg) ;
		
		if(arg){
			var regNodes = $$.filterMatchNodes(parent,arg);
			if(regNodes && regNodes.length > 0){
				parent = regNodes[0] ;
			}
			else parent = null ;
		}
		if(parent){
			result.push(parent) ;
		}
		return result ;
	}
	
	
	
	
	
	
	
	/**
	 * 取得一个包含着所有匹配元素的唯一父元素的元素集合
	 */
	$$.arr.fn.parent = function(){
		var result = [] ,arg = arguments[0];
		[]['forEach'].call(this,function(currNode){
			result = $$.concatNodeArr(currNode.parent(arg),result);
		}) ;
		return result ;
	}
	
	
	
	
	
	
	
	/**
	 * 取得一个包含着所有匹配元素的祖先元素的元素集合（不包含根元素）。可以通过一个可选的表达式进行筛选
	 */
	$$.fn.parents = function(){
		var arg = arguments[0],result = [],parentNodes = [] ;
		var parentNode = this.parentNode ;
		while(parentNode && parentNode.nodeType == 1){
			parentNodes.push(parentNode) ;
			parentNode = parentNode.parentNode ;
		}
		result = parentNodes ;
		arg = regSelectorNodes(arg) ;
		if(arg){
			result = [] ;
			for(var i = 0 ; i < parentNodes.length ; i++){
				result = result.concat($$.filterMatchNodes(parentNodes[i],arg)) ;
			}
		}
		return result ;
	}
	
	
	
	
	
	
	/**
	 * 取得一个包含着所有匹配元素的祖先元素的元素集合（不包含根元素）。可以通过一个可选的表达式进行筛选
	 */
	$$.arr.fn.parents = function(){
		var arg = arguments[0] ,result = [] ;
		[]['forEach'].call(this,function(currNode){
			result = $$.concatNodeArr(currNode.parents(arg),result) ;
		}) ;
		return result ;
	}
	
	
	
	
	
	
	/**
	 * 查找当前元素的所有的父辈元素，直到遇到匹配的那个元素为止
	 * 返回的数组里包含了下面所有找到的父辈元素，但不包括那个选择器匹配到的元素
	 */
	$$.fn.parentsUntil = function(){
		var arg = arguments[0],parentNodes = [];
		arg = regSelectorNodes(arg) ;
		
		if(arg){
			var parentNode = this.parentNode,regNodeArr = $$.filterMatchNodes(parentNode,arg) ;
			while(!regNodeArr || regNodeArr.length <= 0 ){
				parentNodes.push(parentNode) ;
				parentNode = parentNode.parentNode ;
				regNodeArr = $$.filterMatchNodes(parentNode,arg) ;
			}
		}
		else{
			parentNodes = this.parents() ;
		}
 		return parentNodes ;
	}
	
	
	
	
	
	
	
	/**
	 * 查找当前元素的所有的父辈元素，直到遇到匹配的那个元素为止
	 * 返回的数组里包含了下面所有找到的父辈元素，但不包括那个选择器匹配到的元素
	 */
	$$.arr.fn.parentsUntil = function(){
		var result = [] ,arg = arguments[0] ;
		[]['forEach'].call(this,function(currNode){
			result = $$.concatNodeArr(currNode.parentsUntil(arg),result) ;
		});
		return result ;
	}
	
	
	
	
	
	
	
	/**
	 * 取得一个包含匹配的元素集合中每一个元素紧邻的前一个同辈元素的元素集合
	 * 可以用一个可选的表达式进行筛选。只有紧邻的同辈元素会被匹配到，而不是前面所有的同辈元素
	 */
	$$.fn.prev = function(){
		var arg = arguments[0],result = [] ;
		var prevSibling = this.previousSibling ;
		
		while(prevSibling && prevSibling.nodeType != 1){
			prevSibling = prevSibling.previousSibling ;
		}
		if(prevSibling && prevSibling.nodeType == 1){
			result.push(prevSibling) ;
		}
		if(arg){
			result = [] ;
			arg = regSelectorNodes(arg) ;
			result = result.concat($$.filterMatchNodes(prevSibling,arg)) ;
		}
		
		return result ;
	}
	
	
	
	
	
	
	/**
	 * 取得一个包含匹配的元素集合中每一个元素紧邻的前一个同辈元素的元素集合
	 * 可以用一个可选的表达式进行筛选。只有紧邻的同辈元素会被匹配到，而不是前面所有的同辈元素
	 */
	$$.arr.fn.prev = function(){
		var arg = arguments[0],result = [] ;
		[]['forEach'].call(this,function(currNode){
			result = $$.concatNodeArr(currNode.prev(arg),result);		
		}) ;
		return result ;
	}
	
	
	
	
	
	
	
	
	/**
	 * 查找当前元素之前所有的同辈元素
	 */
	$$.fn.prevAll = function(){
		var arg = arguments[0],result = [] ,prevNodes = [];
		var prevSibling = this.previousSibling ;
		while(prevSibling){
			if(prevSibling.nodeType == 1){
				prevNodes.push(prevSibling) ;
			}
			prevSibling = prevSibling.previousSibling ;
		}
		
		arg = regSelectorNodes(arg), result = prevNodes;
		if(arg){
			result = [] ;
			for(var i = 0 ; i < prevNodes.length ; i++){
				result = result.concat($$.filterMatchNodes(prevNodes[i],arg));
			}
		}
		return result ;		
		
	}
	
	
	
	
	
	
	/**
	 * 查找当前元素之前所有的同辈元素
	 */
	$$.arr.fn.prevAll = function(){
		var arg = arguments[0],result = [] ;
		[]['forEach'].call(this,function(currNode){
			result = $$.concatNodeArr(currNode.prevAll(arg),result) ;
		}) ;
		return result ;
	}
	
	
	
	
	
	
	/**
	 * 查找当前元素之前所有的同辈元素，直到遇到匹配的那个元素为止
	 * 如果没有选择器匹配到，或者没有提供参数，那么排在前面的所有同辈元素都会被选中。这就跟用没有提供参数的 .prevAll()效果一样
	 */
	$$.fn.prevUntil = function(){
		var arg = arguments[0] ,result = [],prevAllNode = [];
		
		arg = regSelectorNodes(arg) ;
		result = prevAllNode = this.prevAll() ;
		if(arg){
			result = [] , i = 0,n = 1;
			var regNode = $$.filterMatchNodes(prevAllNode[i],arg) ;
			while((!regNode || regNode.length <= 0) && n <= prevAllNode.length){
				result.push(prevAllNode[i]) ;
				regNode = $$.filterMatchNodes(prevAllNode[++i],arg) ;
				++n ;
			}
		}
		return result ;
		
	}
	
	
	
	
	
	/**
	 * 如果没有选择器匹配到，或者没有提供参数，那么排在前面的所有同辈元素都会被选中。这就跟用没有提供参数的 .prevAll()效果一样
	 */
	$$.arr.fn.prevUntil = function(){
		var arg = arguments[0],result = [] ;
		[]['forEach'].call(this,function(currNode){
			result = $$.concatNodeArr(currNode.prevUntil(),result) ;
		}) ;
		return result ;
	}
	
	
	
	
	
	
	/**
	 * 取得一个包含匹配的元素集合中每一个元素的所有唯一同辈元素的元素集合。可以用可选的表达式进行筛选
	 */
	$$.fn.siblings = function(){
		var arg = arguments[0],result = [],prevNodes = [],nextNodes = [] ;
		prevNodes = this.prevAll() ;
		nextNodes = this.nextAll() ;
		
		result = prevNodes = prevNodes.concat(nextNodes) ;
		if(arg){
			arg = $$(arg) ;
			result = [] ;
			for(var i = 0 ; i < prevNodes.length ; i++){
				var regNodes = $$.filterMatchNodes(prevNodes[i],arg) ; 
				if(regNodes && regNodes.length > 0){
					result.push(prevNodes[i]) ;
				}
			}
		}
		return result ;		
		
	}
	
	
	
	
	
	/**
	 * 取得一个包含匹配的元素集合中每一个元素的所有唯一同辈元素的元素集合。可以用可选的表达式进行筛选
	 */
	$$.arr.fn.siblings = function(){
		var arg = arguments[0] , result = [] ;
		[]['forEach'].call(this,function(currNode){
			result = $$.concatNodeArr(currNode.siblings(arg),result) ;
		}) ;
		return result ;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	/*************************串联模块*************************/
	
	/**
	 * 本非法用于连接分别与两个表达式匹配的元素结果集
	 * 暂不支持以元素在HTML文档中出现的顺序来排序
	 */
	$$.fn.add = function(){
		var arg = arguments[0] ,result = [] ;
		result.push(this);
		
		if(arg){
			arg = regSelectorNodes(arg),len = arg.length,currNode = this;
			for(var i = 0 ; i < len ; i++){
				if(arg[i] instanceof HTMLElement){
					if(!currNode.isEqualNode(arg[i]) || !currNode.parentNode.isEqualNode(arg[i].parentNode)){
						result.push(arg[i]) ;
					}
				}
				if(arg[i] instanceof NodeList){
					[]['forEach'].call(arg[i],function(currRegNode){
						if(!currNode.isEqualNode(currRegNode) || !currNode.parentNode.isEqualNode(currRegNode.parentNode)){
							result.push(currRegNode) ;
						}
					});
				}
			}
		}
		return result ;
	}
	
	
	
	
	
	
	
	/**
	 * 本非法用于连接分别与两个表达式匹配的元素结果集
	 * 暂不支持以元素在HTML文档中出现的顺序来排序
	 */
	$$.arr.fn.add = function(){
		var arg = arguments[0] ,result = [];
		[]['forEach'].call(this,function(currNode){
			result = $$.concatNodeArr(currNode.add(arg),result) ;
		}) ;
		return result ;
	}
	
	
	
	
	
	/**
	 * 查找匹配元素内部所有的子节点（包括文本节点),本方法和childs有冲突 ,暂不解决
	 *
	 */
	$$.fn.contents = function(){
		return []['slice'].call(this.childNodes,0);
		//return this.childNodes;
	}
	
	
	
	
	/**
	 * 查找匹配元素内部所有的子节点（包括文本节点),本方法和childs有冲突 ,暂不解决
	 *  本方法和jquery的方法相比 在元素匹配时去掉了重复的元素
	 */
	$$.arr.fn.contents = function(){
		var result = [] ;
		[]['forEach'].call(this,function(currNode){
			result = $$.concatNodeArr(currNode.contents(),result) ;
		});
		return result ;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/***************************工具方法*****************************/
	/**
	 * 根据指定元素，筛选匹配元素
	 * arg0 : 要判断是否匹配的元素 ， arg1：匹配元素集合
	 */
	$$.filterMatchNodes = function(){
		var dst = arguments[0] ,matchs = arguments[1],result = [];
		if(!dst || !matchs) result = null ;
		
		var dstArr = [] ;
		if(dst instanceof HTMLElement){
			dstArr.push(dst) ;
		}
		if(dst instanceof NodeList){
			dstArr = dst ;
		}
		
		[]['forEach'].call(dstArr,function(currNode){
			for(var i = 0 ; i < matchs.length ; i++){
				var match = matchs[i] ,matchArr = [];
				if(match instanceof HTMLElement){
					matchArr.push(match) ;
				}
				if(match instanceof NodeList){
					matchArr = match ;
				}
				[]['forEach'].call(matchArr,function(matchN){
					if(currNode.isEqualNode(matchN) && 
						((currNode.parentNode && matchN.parentNode && currNode.parentNode.isEqualNode(matchN.parentNode)) 
							|| (!currNode.parentNode && !matchN.parentNode))){
						result.push(currNode) ;
					}
				}) ;
				
			}
		}) ;
		
		return result ;
	}
	
	
	
	
	
	/**
	 * 连接两个数组，并除重
	 */
	$$.concatNodeArr = function(arr1,arr2){
		var result = arr2 ;
		for(var i = 0 ; i < arr1.length ; i++){
			var f = false ,arr1Node = arr1[i];
			for(var j = 0 ; j < arr2.length ; j++){
				var arr2Node = arr2[j] ;
				if(arr1Node.isEqualNode(arr2Node) && arr1Node.parentNode.isEqualNode(arr2Node.parentNode)){
					f = true ;
				}
			}
			if(!f){
				result.push(arr1[i]) ;
			}
		}
		return result ;
	}
	
	
	
	
	
	
	
	/**
	 * 用来在$$、$$.fn命名空间上增加新函数
	 */
	$$.extend = $$.fn.extend = $$.arr.fn.extend = function(){
		var options ,name , src , copy ,copyIsArray ,clone ,
			target = arguments[0] || {} ,
			i = 1 ,
			length = arguments.length ,
			deep = false ;
			
		if(typeof target === 'boolean'){
			deep = target ;
			target = arguments[1] || {} ;
			i = 2 ;
		}
		
		if(typeof target != 'object' && !$$.isFunction(target)){
			target = {} ;
		}	
		
		if(length === i ){
			target = this ;
			--i ;
		}
		for( ; i < length ; i++){
			if( (options = arguments[i]) != null){
				
				for(name in options){
					src = target[ name ] ;
					copy = options[ name ] ;
					if( src === copy ){
						continue ;
					}
					
					if(deep  && copy && ( (copyIsArray == $$.isArray(copy)) || $$.isPlainObject(copy)) ){
						if( copyIsArray ){
							copyIsArray = false ;
							clone = src && $$.isArray(src) ? src : [] ;
							
						}
						else{
							clone = src && $$.isPlainObject(src) ? src :{} ;
						}
						target[ name ] = $$.extend(deep , clone ,copy);
					}
					else if(copy !== undefined){
						target[ name ] = copy ;
					}
				}
			}
		}
		
		return target ;		
	}
	
	
	
	var class2type = {} ,
		trimLeft = /^\s+/ ,
		trimRight = /\s+$/ ,

		rdigit = /\d/,
	
		//JSON RegExp 
		rvalidchars = /^[\],:{}\s]*$/ ,
		rvalidchars = /^[\],:{}\s]*$/,
		rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
		rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
		rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g ,
		
		hasOwn = Object.prototype.hasOwnProperty ,
		toString = Object.prototype.toString ,
		push = Array.prototype.push ,
		slice = Array.prototype.slice ,
		trim = String.prototype.trim ,
		indexOf = Array.prototype.indexOf ;
		
	
	
	$$.isFunction = function(){
		return $$.type(arguments[0]) === "function" ;
	};
	
	
	
	$$.isArray = Array.isArray || function(){
		return $$.type(arguments[0]) === 'array' ;
	}
	
	
	$$.isWindow = function(){
		var obj = arguments[0] ;
 		return obj && typeof obj === 'object' && 'setInterval' in obj ;
	}
	
	
	$$.isNaN = function(){
		var obj = arguments[0] ;
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	}
	
	
	$$.isEmptyObject = function(){
		var obj = arguments[0] ;
		for(var name in obj){
			return false ;
		}
		return true ;
	}
	
	
	$$.error = function(){
		var msg = arguments[0] ;
		throw msg
	}
	
	
	
	$$.trim = function(){
		var text = arguments[0] ;
		return text == null ? 
			"" :
			text.toString().replace(trimLeft, "").replace(trimRight , "") ;
	}
	
	
	
	$$.parseJSON = function(){
		var data = arguments[0] ;
		if(typeof data !== 'string' || !data){
			return null ;
		}
		
		data = $$.trim(data) ;
		
		if(window.JSON && window.JSON.parse){
			return window.JSON.parse( data ) ;
		}
		
		if( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ){
			
			return (new Function("return " + data))() ;
		}
		$$.error( "Invalid JSON: " + data ) ;
		
	}
	
	
	$$.parseXML = function(){
		var data = arguments[0] ,xml ,tmp ;
		
		try{
			//Standard
			if(window.DOMParser){
				tmp = new DOMParser() ;
				xml = tmp.parseFromString(data , "text/xml") ;
			}
			else{//IE
				xml = new ActiveXObject("Microsoft.XMLDOM") ;
				xml.async = "false" ;
				xml.loadXMl(data) ;
			}
		}catch(e){
			xml = undefined ;
		}
		
		if(!xml || !xml.documentElement || !xml.getElementByTagName("parsererror").length){
			$$.error( "Invalid XML: " + data ) ;
		}
		return xml ;
	}
	
	
	
	$$.type = function(){
		var obj = arguments[0] ;
		return obj == null ? 
			String(obj) :
			class2type[ toString.call(obj) ] || "object";
	};
	
	
	
	$$.isPlainObject = function(){
		var obj = arguments[0] ;
		
		if(!obj || $$.type(obj) !== "object" || obj.nodeType || $$.isWindow(obj)){
			return false ;
		}
		
		try{
			if(obj.constructor &&
				!hasOwn.call(obj , "constructor") &&
				!hasOwn.call(obj.constructor.prototype ,"isPrototypeOf")){
				return false ;
			}
		}
		catch(e){
			return false ;
		}
		
		var key ;
		for(key in obj){}
		
		return key === undefined ||  hasOwn.call(obj,key) ;
	}
	
	
	//each遍历对象和数组等元素
	$$.each = function(){
		var object = arguments[0],
			callback = arguments[1],
			args = arguments[2],
			name , i = 0 ,length = object.length ,
			isObj = length === undefined || $$.isFunction(object);
			
		if(args){
			if(isObj){
				for(name in object){
					if(callback.apply(object[name] ,args) === false ){
						break ;
					}
				}
			}
			else{
				for( ; i < length ; ){
					if(callback.apply(object[ i++ ], args) === false){
						break ;
					}
				}
			}
		}
		else{
			if(isObj){
				for( name in object){
					if(callback.call(object[ name ] , name , object[ name ]) === false ){
						break ;
					}
				}
			}
			else{
				for( ; i < length ; ){
					if(callback.call(object[ i], i , object[ i++ ]) === false){
						break ;
					}
				}
			}
		}
		
		return object ;
	} ;
	
	
	
	
	$$.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(i,name){
		class2type["[object " + name + "]" ] = name.toLowerCase() ;
	}) ;
	
	
	
	
	
	$$.inArray = function(){
		var elem = arguments[0] ,
			array = arguments[1] ;
			
		if(!array){
			return -1 ;
		}
		
		if( indexOf ){
			return indexOf.call(array , elem) ;
		}
		
		for(var i = 0 , length = array.length ; i < length ; i++){
			if(array[ i ] === elem ){
				return i ;
			}
		}
		
		return -1 ;		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/*************************延迟对象*************************/
	//定义延迟对象（本不想搞这么麻烦，但延迟对象。。。所以必须解决这个问题，这里借鉴了jquery的延迟对象 ， 延迟对象关键在于理解什么时候触发，怎么触发）
	
	var promiseMethods = "done fail isResolved isRejected promise then always".split( " " ),
	// Static reference to slice
	sliceDeferred = [].slice;
	
	$$.extend({
		_Deferred : function(){
			var callbacks = [] ,
				fired ,
				firing ,
				cancelled ,
				deferred = {
					done : function(){
						if(!cancelled){
							var args = arguments ,
								i ,
								length ,
								elem ,
								type ,
								_fired ;
							if(fired){
								_fired = fired ;
								fired = 0 ;
							}
							for( i = 0 , length = args.length ; i < length ; i++){
								elem = args[i] ;
								type = $$.type(elem) ;
								if(type === "array"){
									deferred.done.apply(deferred,elem) ;
								}
								else if( type === "function"){
									callbacks.push(elem) ;
								}
							}
							if(_fired){
								deferred.resolveWith(_fired[ 0 ] , _fired[ 1 ]) ;
							}
						}
						return this ;
					} ,
					
					resolveWith : function(){
						var contexts = arguments[0] ,
							args = arguments[1] ;
						
						if(!cancelled && !fired && !firing){
							args = args || [] ;
							firing = 1 ;
							try{
								while(callbacks[0]){
									callbacks.shift().apply(contexts,args) ;
								}
							}
							finally{
								fired = [contexts , args] ;
								firing = 0 ;
							}
						}
						return this ;
					} ,
					
					resolve : function(){
						deferred.resolveWith(this,arguments) ;
						return this ;
					} ,
					
					isResolved : function(){
						return !!(firing || fired) ;
					} ,
					
					cancel : function(){
						cancelled = 1 ;
						callbacks = [] ;
						return this ;
					}
				} ;
			return deferred ;	
		} ,
		
		//对外提供的异步“延迟”对象，管理一个回调的列表，在最新的jquery中 ，对该对象进行的重写，特别是then方法  
		//从jquery的1.8后 then方法不仅仅添加回调函数队列 ，还返回的一个新的异步对象 ， 也就是说then方法添加到
		//队列的对象是一个新对象 而不是现在的同一个异步对象 ，并且还提供一个专门处理异步队列的函数 ， 具体思想类似链表
		//的方式 
		Deferred : function(){
			var func = arguments[0] ,
				deferred = $$._Deferred() ,
				failDeferred = $$._Deferred() ,
				promise ;
			
			$$.extend(deferred , {
				then : function(){
					var doneCallbacks = arguments[0] ,
						failCallbacks = arguments[1] ;
					deferred.done( doneCallbacks ).fail( failCallbacks ) ;
					return this ;
				} ,
				always : function(){
					return deferred.done.apply(deferred , arguments).fail.apply(this, arguments ) ;
				} ,
				fail : failDeferred.done ,
				rejectWith : failDeferred.resolveWith ,
				reject : failDeferred.resolve ,
				isRejected : failDeferred.isResolved ,
				promise : function(){
					var obj = arguments[0] ;
					if(obj == null ){
						if( promise ){
							return promise ;
						}
						promise = obj = {} ;
					}
					var i = promiseMethods.length ;
					while( i-- ) {
						obj[promiseMethods[i]] = deferred[promiseMethods[i]] ;
					}
					return obj ;
				}
			}) ;
			
			//deferred的回调成功队列和失败队列只能有一个执行
			deferred.done(failDeferred.cancel ).fail(deferred.cancel) ;
			
			delete deferred.calcel ;
			
			if( func ){
				//如果传入函数参数，则函数的的上下文为deferred对象  并把deferred对象作为该函数的参数
				func.call(deferred , deferred) ;
			}
			return deferred ;
		} ,
		//该函数接收的参数为deferred对象，当传入的deferred异步对象都执行完毕后，根据执行的情况，回调deferred的成功或失败函数列表
		when : function(){
			var args = arguments ,
				i = 0 ,
				length = args.length ,
				count = length ,
				firstParam = arguments[0] ,
				deferred = length <=1 && firstParam && $$.isFunction(firstParam.promise) ?
					firstParam :
					$$.Deferred();
			function resolveFunc ( i ) {
				return function( value ) {
					args[ i ] = arguments.length > 1 ? sliceDeferred.call(arguments,0) : value ;
					if(!(--count)){
						deferred.resolveWith(deferred , sliceDeferred.call(args , 0));
					}
				} ;
			}
			if( length > 1){
				for( ; i < length ; i++){
					if(args[ i ] && $$.isFunction(args[ i ].promise)){
						//
						args[ i ].promise().then( resolveFunc(i), deferred.reject ) ;
					}
					else{
						--count ;
					}
				}
				if( !count ){
					deferred.resolveWith(deferred , args) ;
				}
			}
			else if(deferred !== firstParam){
				deferred.resolveWith(deferred , args ) ;
			}
			return deferred.promise() ;
		}
		
	}) ;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/***************************事件**************************/
	
	var readList = null ;
	
	
	DOMContentLoaded = null ;
	
	if(document.addEventListener){
		DOMContentLoaded = function(){
			document.removeEventListener('DOMContentLoaded',DOMContentLoaded,false) ;
			$$.ready() ;
		}
	}
	else if(document.attachEvent){
		DOMContentLoaded = function(){
			if( document.readyState === "complete" ){
				document.detachEvent("onreadystatechange",DOMContentLoaded) ;
				$$.ready() ;
			}
		}
	}
	
	
	$$.fn.ready = $$.arr.fn.ready = function(){
		var fn = arguments[0] ;
		$$.bindReady() ;
		//添加回调函数
		readList.done( fn );
		return this ;
	}
	
	
	
	$$.extend({
		isReady : false ,
		readyWait : 1 ,
		holdReady : function(){
			var hold = arguments[0] ;
			if( hold ){
				$$.readyWait++ ;
			}
			else{
				$$.ready(true) ;
			}
		} ,
		bindReady : function(){
			
			if( readList ){
				return ;
			}
			//创建延迟对象
			readList = $$._Deferred() ;
			//判断文档是否加载完成			
			if(document.readyState === "complete"){
				return setTimeout($$.ready , 1) ;
			}
			
			if(document.addEventListener){
				document.addEventListener( "DOMContentLoaded" , DOMContentLoaded ,false);
				window.addEventListener("load" , $$.ready , false) ;
			}
			else if(document.attachEvent){
				document.attachEvent("onreadystatechange" , DOMContentLoaded ) ;
				window.attachEvent("onload" , $$.ready ) ;
			}
		} ,
		
		ready : function(){
			var wait = arguments[0] ;
			if((wait === true && !--$$.readyWait) || (wait !== true && !$$.isReady)){
				
				if(!document.body){
					return setTimeout($$.ready , 1) ;
				}
				
				$$.isReady = true ;
				
				if(wait !== true && --$$.readyWait > 0){
					return ;
				}
				
				readList.resolveWith(document , [$$]) ;				
				
				if($$.fn.trigger){
					$$(document).trigger("ready").unbind("ready") ;
				}
			}
		}
	}) ;
	
	
	
	
	var eventTypeArr = ["blur","change","click","dblclick","error","focus","focusin","focusout",
						"keydown","keyup","mousedown","mouseenter","mouseleave","mousemove","mouseout",
						"mouseover","mouseup","resize","srcoll","select","submit","unload"] ;                                                     
	
	
	/**
	 * 事件操作 ,暂时提供事件绑定、事件解除、事件触发三个最实用的方法
	 */
	$$.fn.extend({
		on : function(){
			var type = arguments[0] ,
				callback = arguments[1] , 
				isBubble = arguments[2] || false ,
				dst = this ;
			if(!callback){
				return this ;
			}
			if(type.indexOf(" ") > 0){
				var typeArr = type.split(" ") ;
				if(typeArr && typeArr.length > 0){
					for(var i = 0 , length = typeArr.length ; i < length ; i++){
						dst.on(typeArr[i] , callback , isBubble) ;
					}
				}
				return this;
			}
			
			if(!$$.inArray( type, eventTypeArr ) && !$$.isFunction( callback )){
				return this;
			}
				
			dst[type+'callback'] = callback ;
			dst[type+'isBubble'] = isBubble ;
			if(document.addEventListener){
				dst.addEventListener( type , callback , isBubble ) ;
			}
			else if(document.attachEvent){
				dst.attachEvent('on'+type , callback ) ;
			}
			
			return this ;
			
		},
		off : function(){
			var type = arguments[0] ,
				dst = this ,
				isBubble ,
				callback ;
				
			if(!type){
				return this;
			}
			
			callback = dst[type+'callback'] ;
			isBubble = dst[type+'isBubble'] ;
			if(document.removeEventListener){
				dst.removeEventListener( type , callback , isBubble);
			}
			else if(document.detachEvent){
				dst.detachEvent("on" + type , callback) ;
			}
			
			return this ;
			
		} ,
		
		bind : function(){
			var type = arguments[0] ,
				callback  = arguments[1] ,
				events ,
				name ,
				dst = this ;
			
			if(!callback){
				events = type ;
				if($$.type(events) === "object" ){
					for( name in events){
						callback = events[ name ] ;
						dst.on( name , callback ) ;
					}
				}
				
				return this ;
			}
			
			if($$.inArray( type , eventTypeArr) && $$.isFunction( callback )){
				dst.on( type , callback ) ;
			}
			return this ;
		} ,
		
		one : function(){
			var type = arguments[0] ,
				callback = arguments[1] ,
				dst = this ;
				
			if($$.inArray( type , eventTypeArr ) && $$.isFunction( callback )){
				var newcallback = function(){
					callback.apply(this,arguments) ;
					dst.off( type , newcallback) ;
				}
				dst.on( type , newcallback ) ; 
			}
			return this ;			
		} ,
		
		trigger : function() {
			var type = arguments[0] ,
				data = arguments[1] || {} ,
				event = document.createEvent('HTMLEvents');
				
			if(!type || !$$.inArray( eventTypeArr )){
				return this ;
			}
			event.initEvent( type , true ,true ) ;
			event.data = data ;
			event.eventName = type ;
			event.target = this ;
			this.dispatchEvent( event ) ;			
			return this ;
		}
	}) ;
	
	
	
	
	eventTypeArr['forEach'](function( type , i ){
		$$.fn[type] = function(){
			var callback = arguments[0] ,
				dst = this ;
			if(!callback || !$$.isFunction( callback ) ){
				return this ;
			}
			dst.on( type , callback ) ;
		} ;
		$$.arr.fn[type] = function () {
			var elems = this ,
				args = arguments ;
			
			[]['forEach'].call( elems , function( elem ){
				elem[type].apply( elem , args ) ;
			}) ;
		}
	}) ;
	
	
	
	["on" , "off" , "bind" , "one" , "trigger"].forEach(function(type){
		var obj = {};
		obj[type] = function() {
			var elems = this ,
				args = arguments ;
			[]['forEach'].call(elems,function(elem){
				elem[type].apply(elem,args) ;
			}) ;
		}
		$$.arr.fn.extend(obj) ;
	}) ;
	
	
	
	
	
	
	
	
	
	
	/***************************ajax**************************/
	
	$$.extend({
		/**
		 * event对象只要针对ajax的事件 
		 */
		event : {
			//查询绑定事件的元素集合
			findElems : function () {
				
				var eventType = arguments[0] ,
					elem = this ,
					childs = elem.childNodes ,
					result = []  ;
				if( !eventType ){
					return ;
				}
				
				if(elem && elem[ eventType + 'callback' ]){
					result.push(elem) ;
				}
				if(childs && childs.length > 0){
					[]['forEach'].call( childs , function(child) {
						if( child &&  child[ eventType + 'callback' ]){
							result.push( child ) ;
						}
						result = $$.concatNodeArr($$.event.findElems.call( child , eventType ) , result ) ;
					});
				}
				
				return result ;
				
			} ,
			//触发事件
			trigger : function () {
				var eventType = arguments[0] ,
					elem ,
					elems ,
					i = 0 ,
					length ;
					
				if( !eventType ){
					return ;
				}
				elems = $$.event.findElems.call( document.body , eventType ) ;
				length = elems.length ;
				if( length > 0 ){
					for( ; i < length ; i++) {
						elem = elems[ i ] ;
						elem.trigger( eventType ) ;
					}
				}
			}
		} ,
		//活动的ajax个数，ajax计数器
		active : 0 ,
		/**
		 * ajax参数暂时用到url , type , data , dataType , success , error几个参数
		 * 参数格式 : {url,{settings}} 或 {settings}
		 */
		ajax : function(){
			var url = arguments[0] ,
				settings = arguments[1] ,
				xhr ,jqxhr ,
				deferred = $$.Deferred() ;
				
			if(window.XMLHttpRequest){
				xhr = new XMLHttpRequest() ;
			}
			else if(window.ActiveXObject){
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
			jqxhr = deferred.promise(xhr) ;
			if(!settings){
				settings = url ;
			}
			else {
				settings.url = url ;
			}
			if($$.type( settings ) !== "object"){
				return ;
			}
			
			jqxhr.onreadystatechange = function(){
				var completed = 4 ;
				if(jqxhr.readyState == completed){
					
					if(jqxhr.status == 200){
						
						$$.event.trigger('ajaxSuccess') ;
						$$.event.trigger('ajaxComplete') ;	
						if( !(--$$.active ) ){
							$$.event.trigger('ajaxStop') ;						
						}
						
						var dataType = settings.dataType ,
							responseText = jqxhr.responseText ;
						if(dataType && dataType == "script"){
							
							var script = document.createElement('script')  ,
								head = document.head || document.getElementByTagName("head")[0] || document.documentElement ;
								
							script.src = settings.url ;
							script.async = "async" ;
							//IE onreadystatecahnge  其他浏览器 onload
							try{
								head.appendChild(script) ;
								script.onload = script.onreadystatecahnge = function (){
									script.onload = script.onreadystatechange = null;
									if( head && script.parentNode ){
										head.removeChild( script ) ;
									}
									script = undefined ;
									settings.success(responseText,jqxhr) ;
									deferred.resolve() ;
								}
							}catch(e){
								deferred.reject() ;	
							}
							
							
						}
						else{
							if( settings.success ){
								var successcallback = function( data , jqxhr ){
									
									if(dataType && dataType == 'json'){
										data = $$.parseJSON( data ) ;
									}
									if(dataType && dataType == "xml"){
										data = $$.parseXML( data ) ;
		 							}
		 							
									settings.success(data,jqxhr) ;
								}
								successcallback.call( jqxhr , responseText , jqxhr );
							}
							deferred.resolve() ;
						}
					}
					else{
						$$.event.trigger('ajaxError') ;
						$$.event.trigger('ajaxComplete') ;	
						if( !(--$$.active ) ){
							$$.event.trigger('ajaxStop') ;						
						}
						if( settings.error ){
							var failcallback = function(jqxhr){
								settings.error(jqxhr) ;
								
							}
							failcallback.call( jqxhr , jqxhr ) ;
						}
						
						deferred.reject() ;
					}
				}
			}
			settings.type = settings.type || "get"  ;
			if( ++$$.active == 1 ){
				$$.event.trigger( 'ajaxStart' ) ;
			}
			$$.event.trigger( 'ajaxSend' ) ;
			jqxhr.open(settings.type,settings.url,true) ;
			jqxhr.send(settings.data);
			return jqxhr ;
			
		} ,
		/**
		 * 参数格式 ： {url ,[callback]},暂时支持两个参数
		 */
		get : function () {
			var url = arguments[0] ,
				callback = arguments[1] ,
				settings = {};
			if( !url ){
				return ;
			}
			settings.url = url ;
			settings.type = "get" ;
			
			if( callback && $$.isFunction(callback) ){
				settings.success = callback ;
			}
			
			return $$.ajax(settings) ;
		} ,
		/**
		 * 参数格式 ： {url ,[callback]} ,暂时支持两个参数
		 */
		getJSON : function () {
			var url = arguments[0] ,
				callback = arguments[1] ,
				settings = {} ;
			
			if( !url ) {
				return ;
			}
			settings.url = url ;
			settings.type = "get" ;
			settings.dataType = "json" ;
			if( callback && $$.isFunction(callback) ){
				settings.success = callback ;
			}
			
			return $$.ajax(settings) ;
		} ,
		/**
		 * 参数格式 ：( url, [data], [callback], [type] )
		 */
		post : function () {
			var url = arguments[0] ,
				data = arguments[1] ,
				callback = arguments[2] ,
				type = arguments[3] ,
				settings = {} ;
			if( !url ){
				return ;
			}
			settings.url = url ;
			if( data && $$.type(data) == "object"){
				settings.data = data ;
				if( callback && $$.isFunction( callback ) ){
					settings.success = callback ;
					if(type && $$.type( type ) == "string"){
						settings.dataType = type ;
					}
				}
				else if(callback && $$.type(callback) == "string"){
					settings.dataType = type ;
				}
			}
			else if(data && $$.isFunction(data)){
				settings.success = data ;
				if( callback && $$.type(callback) == "string" ){
					settings.dataType = type ;
				}
			}
			settings.type = "post" ;
			
			return $$.ajax(settings) ;
		} ,
		getScript : function (){
			var url = arguments[0] ,
				callback = arguments[1] ,
				settings = {};
			if( !url ){
				return ;
			}
			settings.url = url + "?t="+ new Date().getTime()  ;
			settings.dataType = "script" ;
			settings.success = callback ;
			$$.ajax(settings) ;
		}
		
	}) ;
	
	
	
	
	
	$$.fn.extend({
		load : function(){
			var url = arguments[0] ,
				callback = arguments[1] ,
				type = "get",
				xhr ,
				jqxhr ,
				deferred = $$.Deferred() ,
				elem = this ;
				
			if(window.XMLHttpRequest){
				xhr = new XMLHttpRequest() ;
			}
			else if(window.ActiveXObject){
				xhr = new ActiveXObject("Microsoft.XMLHTTP"); 
			}
			
			jqxhr = deferred.promise(xhr) ;
			jqxhr.onreadystatechange = function () {
				var completed = 4 ;
				if(jqxhr.readyState == completed){
					if( jqxhr.status == 200 ) {
						var responseText = jqxhr.responseText ;
						elem.html(responseText) ;
						if( callback ){
							callback.call( elem , jqxhr) ;
						}
					}
				}
			}
			
			jqxhr.open( type , url );
			jqxhr.send( null ) ;
			return elem ;
		}
	}) ;
	
	
	
	
	$$.arr.fn.extend({
		load : function () {
			var url = arguments[0] ,
				callback = arguments[1] ,
				elems = this ,
				xhr ,
				jqxhr ,
				responseText ,
				type = "get" ,
				deferred = $$.Deferred();
			if(!url){
				return this ;
			}
			if(window.XMLHttpRequest){
				xhr = new XMLHttpRequest() ;
			}
			else if(window.ActiveXObect) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP") ;
			}
			jqxhr = deferred.promise( xhr );
			jqxhr.onreadystatechange = function () {
				var completed = 4 ;
				if(jqxhr.readyState == completed ){
					if( jqxhr.status == 200 ){
						responseText = jqxhr.responseText ;
						[]['forEach'].call( elems , function( elem ){
							elem.html( responseText ) ;
						});
						if( callback ){
							callback.call( elems , jqxhr ) ;
						}
					}
				}
			}
			
			
			jqxhr.open( type , url ) ;
			jqxhr.send( null ) ;
			return elems ;
		}
	}) ;
	
	
	
	
	/**
	 * 定义ajax事件 ，ajax事件的触发时机很重要 
	 */
	$$.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ) , function (index , event) {
		$$.fn[ event ] = function( f ){
			return this.bind( event , f ) ;
		} ;
		$$.arr.fn[ event ] = function( f ) {
			[]['forEach'].call(this , function( elem ){
				return elem.bind( event , f ) ;
			}) ;
		}
	}) ;
	
	
	
	
	
	
	
	
	
	
	
	
	
	/****************************工具方法补充****************************/
	$$.extend({
		//使用过滤函数过滤数组元素
		grep : function () {
			var elems = arguments[0] ,
				callback = arguments[1] ,
				inv = !!arguments[2] ,
				ret = [];
			if( !$$.isArray(elems) ){
				return ;
			}
			for(var i = 0 , length = elems.length ; i < length ; i++){
				retVal = !!callback( elems[i] , i ) ;
				if( inv !== retVal ){
					ret.push( elems[ i ] ) ;
				}
			}
			return ret ;
		} ,
		//合并两个数组
		merge : function(){
			var first = arguments[0] ,
				second = arguments[1] ,
				i = first.length ,
				j = 0 ;
				
			if( typeof second.length === "number" ){
				for( var l = second.length ; j < l ; j++ ){
					first[ i++ ] = second[ j ] ;
				}
			}
			else{
				while( second[ j ] !== undefined ){
					first[ i++ ] = second[ j++ ] ;
				}
			}
			first.length = i ;
			
			return first ;
		} ,
		//将类数组对象转换为数组对象
		makeArray : function (){
			var	array = arguments[0] ,
			 	ret = arguments[1] || [] ;
			
			if( array != null ){
				var type = $$.type( array ) ;
				if( array.length == null || type === "string" || type === "function" || type === "regexp" || $$.isWindow(array)){
					Array.prototype.push.call( ret , array ) ;
				}
				else{
					$$.merge( ret , array ) ;
				}
			}
			
			return ret ;
		} ,
		map : function (){
			var elems = arguments[0] ,
				callback = arguments[1] ,
				arg = arguments[2] ,
				value, key, ret = [],
				i = 0,
				length = elems.length,
				isArray = length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || $$.isArray( elems ) ) ;
	
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret[ ret.length ] = value;
					}
				}
	
			} else {
				for ( key in elems ) {
					value = callback( elems[ key ], key, arg );
	
					if ( value != null ) {
						ret[ ret.length ] = value;
					}
				}
			}
	
			return ret.concat.apply( [], ret );
		}
	}) ;
	
	
	
	
	window.$$ = $$ ;

})(window,document) ;





/**
 * 
 * 开始写jquery-free.js时只是为了打发闲暇无趣的时间
 * 由于自身水平、精力有限，代码本身可能不太严谨 ，测试也不太系统 ，也可能存在错误，欢迎指出 
 * 1459815090@qq.com 
 * 
 */
















