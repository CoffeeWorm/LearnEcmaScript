class Node {
  constructor(data, left, right) {
    this.data = data || null;
    this.leftChild = left || null;
    this.rightChild = right || null;
  }
  show() {
    return this.data;
  }
}

class BinaryTree {
  constructor(Node) {
    this.root = Node || null;
  }

  insertNode(node) {
    let current = this.root;
    let parent;
    if (current === null) {
      this.root = node;
    } else {
      while (true) {
        parent = current;
        if (current.data >= node.data) {
          current = current.left;
          if (current == null) {
            parent.left = node;
            break;
          }
        } else {
          current = current.right;
          if (current == null) {
            parent.right = node;
            break;
          }
        }

      }
    }
  }

  innerWalk(node) {
    if (!(node == null)) {
      this.innerWalk(node.left);
      console.log('walk', node.show());
      this.innerWalk(node.right);
    }
  }
}

let tree = new BinaryTree();
tree.insertNode(new Node(20));
tree.insertNode(new Node(15));
tree.insertNode(new Node(22));
tree.insertNode(new Node(11));
tree.insertNode(new Node(18));
tree.insertNode(new Node(21));

tree.innerWalk(tree.root)