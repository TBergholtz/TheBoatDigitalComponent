function TEdge(aNode, aNeighbor, aWeight){
    this.node = aNode;
    this.neighbor = aNeighbor;
    this.weight = aWeight;
}

function TGraph() {
    const nodes = [];
    const edges = {};
    const graph = this;

    // Must have in order to make priorityQueue work!!!
    function compare(){
        return false;
    }

    this.dijkstra = function (aNode) {
        let distances = {};
        const nearest = {name: aNode, dist: Infinity};

        // Stores the reference to previous nodes
        let prev = {};
        let pq = new PriorityQueue({compare: compare});
        const nodeName = aNode.name;

        // Set distances to all nodes to be infinite except startNode
        distances[nodeName] = 0;
        pq.enqueue(aNode, 0);
        nodes.forEach(node => {
            if (node.name !== nodeName){
                distances[node.name] = Infinity;
            } 
            prev[node.name] = null;
        });

        while (!pq.isEmpty()) {
            let minNode = pq.dequeue();
            let currNode = minNode.data || minNode;
            let weight = minNode.priority;
            edges[currNode.name].forEach(node => {
                let alt = distances[currNode.name] + node.weight;
                if (alt < distances[node.neighbor.name]) {
                    distances[node.neighbor.name] = alt;
                    prev[node.neighbor.name] = currNode;
                    pq.enqueue(node.neighbor, distances[node.neighbor]);
                }
                if((nearest.dist > alt) && (node.node.isIsland)){
                    nearest.name = node.node.name;
                    nearest.dist = alt;
                }
            });
        }
        return this.getNode(nearest.name);

    }

    this.addNode = function (aNode) {
        nodes.push(aNode);
    }

    this.addDirectedEdge = function(aNode1, aNode2, aValue){
        createEdgeList(aNode1.name);
        createEdgeList(aNode2.name);
        edges[aNode1.name].push(new TEdge(aNode1, aNode2, aValue));
        edges[aNode2.name].push(new TEdge(aNode2, aNode1, aValue));
    };

    this.getNode = function(aName){
        for(let i = 0; i < nodes.length; i++){
            if(nodes[i].name === aName){
                return nodes[i];
            }
        }
        return null;
    };

    function createEdgeList(aNode){
        if(edges[aNode] === undefined){
            edges[aNode] = [];
        }
    }
}


