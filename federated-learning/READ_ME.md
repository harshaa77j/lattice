**Problem here**
Why should data always be sent to a centre? (in context of mobile phones). Main concern here is privacy.
*Different from the project, its rather just division of tasks across a distributed system*

**Proposed solution**
Aggregating locally computed updates called ==Federated learning==. An advantage is the lack of need of raw training data

**How its done**
SGD: Stochastic Gradient Descent 
Here, we have all data in one place
in each step:
- pick a random mini-batch of data points
- compute gradient
- update weights

$$
*w(t+1)​=wt​−η∇f(wt​)* (or)
$$
new model=old model-(small step in wrong direction)

Updated version of SGD:FedAvg
Data is spread across many clients
So instead of sampling data points, we sample
- random clients (pick a fraction C of clients)
- each client samples its own data (it does mini-batch SGD locally)

$$
*w(t+1​)=k∑​(nk/n)​​wtk​*
$$

==These control how FedAvg behaves:==
1. **C = how many people participate**
- Small C → fewer people per round
- Big C → more people (better, but slower)
1. **E = how long each person trains**
- Small E → tiny updates
- Big E → bigger changes
1. **B = how much data used at once**
- Small B → more randomness
- Big B → more stable updates

source: arxiv.org/abs/1602.05629
